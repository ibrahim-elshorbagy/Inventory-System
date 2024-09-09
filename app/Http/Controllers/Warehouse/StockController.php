<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product\Product;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\Warehouse;
use Illuminate\Http\Request;
use App\Http\Resources\Warehouse\CustomerStockResource;
use App\Models\Warehouse\StockTransaction;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{

    /*
    Stock Controller :for adding updating and deleting stock from warehouse
    */



    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show Create Form for Adding Stock to Warehouse for Customer.
     */
    public function create(Customer $customer)
    {
            $customer->load(['user:id,name']);

            $proudcts=Product::query()->where('is_active', 1)->select('id', 'name','unit')->get();

            $warehouses = Warehouse::query()->where('is_active', 1)->select('id', 'name')->get();

            return inertia("Warehouses/Stock/Create",
            [
                'products' => $proudcts,
                'customer' => $customer,
                'warehouses' => $warehouses
            ]
        );

    }

    /**
     * Added the stock to the warehouse create new record or update the existing.
     */
        public function store(Request $request)
        {

            // Validate the request
            $data = $request->validate([
                'user_id' => ['required', 'exists:users,id'],
                'warehouse_id' => ['required', 'exists:warehouses,id'],
                'product_quantities' => ['required', 'array', 'min:1'],
                'product_quantities.*.product_id' => ['required', 'exists:products,id'],
                'product_quantities.*.quantity' => ['required', 'numeric', 'gt:0'],
            ], [
                'product_quantities.required' => 'The Full Product selection is required.',
                'product_quantities.*.product_id.required' => 'The product field is required.',
                'product_quantities.*.quantity.required' => 'The quantity field is required.',
                'product_quantities.*.quantity.gt' => 'The quantity must be greater than zero.',
            ]);


            // Loop through the product quantities
            foreach ($data['product_quantities'] as $productData) {

                // Check if a stock record already exists
                $existingStock = Stock::where('user_id', $data['user_id'])
                    ->where('warehouse_id', $data['warehouse_id'])
                    ->where('product_id', $productData['product_id'])
                    ->first();

                if (!$existingStock) {
                    // If it doesn't exist, create a new stock record
                    $existingStock = Stock::create([
                        'user_id' => $data['user_id'],
                        'warehouse_id' => $data['warehouse_id'],
                        'product_id' => $productData['product_id'],
                        'quantity' => 0, // Initialize with 0, actual balance will be updated
                    ]);
                }

                // Record the transaction in the stock_transactions table
                StockTransaction::create([
                    'stock_id' => $existingStock->id,
                    'quantity' => $productData['quantity'],
                    'transaction_type' => 'addition',
                ]);

                // Update the balance in the stocks table
                $this->updateStockBalance($existingStock->id);
            }

            $locale = session('app_locale', 'en');
            $message = $locale === 'ar' ? "تم اضافة المنتجات بنجاح" : "Products were added successfully";

            return to_route('customer.stock.show', $data['user_id'])->with('success', $message);
        }

        private function updateStockBalance($stockId)
        {
            $balanceQuery = DB::table('stock_transactions')
                ->select(
                    DB::raw('SUM(CASE WHEN transaction_type = "addition" THEN quantity ELSE 0 END) as total_in'),
                    DB::raw('SUM(CASE WHEN transaction_type = "release" THEN quantity ELSE 0 END) as total_out')
                )
                ->where('stock_id', $stockId)
                ->first();

            $balance = $balanceQuery->total_in - $balanceQuery->total_out;

            // Update the balance in the stocks table
            Stock::where('id', $stockId)->update(['quantity' => $balance]);
        }


    /**
     * Show Cusomter Stock Report.
     */
    public function show(Customer $customer)
    {
        $user = $customer->user->only('id', 'name', 'email');

        // Combine the customer and user information
        $customerInfo = array_merge(
            $customer->only('phone'),
            $user
        );

        $query = Stock::query()
            ->where('user_id', $customer->user_id)
            ->select('id', 'user_id', 'warehouse_id', 'product_id', 'quantity')
            ->with([
                'product:id,name,unit',
                'warehouse:id,name',
            ]);

        // Implementing the search for product name
        if (request("name")) {
            $query->whereHas('product', function($q) {
                $q->where("name", "like", "%" . request("name") . "%");
            });
        }


        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        $products = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Warehouses/Stock/CustomerStock', [
            'products' => CustomerStockResource::collection($products),
            'user' => $customerInfo,
            'success' => session('success'),

        ]);
    }
    public function printAll(Customer $customer)
    {
        $user = $customer->user->only('id', 'name', 'email');

        // Combine customer and user information
        $customerInfo = array_merge(
            $customer->only('phone', 'address'),
            $user
        );

        // Fetch all products without pagination
        $products = Stock::query()
            ->where('user_id', $customer->user_id)
            ->select('id', 'user_id', 'warehouse_id', 'product_id', 'quantity')
            ->with([
                'product:id,name,unit',
                'warehouse:id,name',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Warehouses/Stock/PrintCustomerStock', [
            'products' => CustomerStockResource::collection($products),
            'user' => $customerInfo,
        ]);
    }


    /**
     * Show the form for editing the Customer Stock.
     */
    public function edit(Customer $customer)
    {
            $customer->load(['user:id,name']);

            $proudcts=Product::query()->where('is_active', 1)->select('id', 'name','unit')->get();

            $warehouses = Warehouse::query()->where('is_active', 1)->select('id', 'name')->get();

            $myProducts = Stock::query()
            ->where('user_id', $customer->user_id)
            ->select('id', 'user_id', 'warehouse_id', 'product_id', 'quantity')
            ->with([
                'product:id,name,unit',
                'warehouse:id,name',
            ])
            ->get();
            return inertia("Warehouses/Stock/Edit",
            [
                'products' => $proudcts,
                'customer' => $customer,
                'warehouses' => $warehouses,
                'myProducts' => $myProducts
            ]
        );

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
    $locale = session('app_locale', 'en');

    DB::beginTransaction();
    try {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'warehouse_id' => ['required', 'exists:warehouses,id'],
            'product_quantities' => ['array'],
            'product_quantities.*.product_id' => ['required_with:product_quantities', 'exists:products,id'],
            'product_quantities.*.quantity' => ['required_with:product_quantities', 'numeric', 'gt:0'],
        ]);

          if (empty($data['product_quantities'])) {
            // Delete all stock records for this user and warehouse
            Stock::where('user_id', $data['user_id'])
                 ->where('warehouse_id', $data['warehouse_id'])
                 ->delete();

            DB::commit();

            $message = $locale === 'ar' ? "تم حذف جميع المنتجات بنجاح" : "All products were successfully removed";
            return to_route('customer.stock.show', $data['user_id'])->with('success', $message);
        }


        // Get the current stock records for the user and warehouse
        $existingStocks = Stock::where('user_id', $data['user_id'])
            ->where('warehouse_id', $data['warehouse_id'])
            ->get();

        // Get an array of the current product IDs
        $existingProductIds = $existingStocks->pluck('product_id')->toArray();

        // Get an array of the updated product IDs
        $updatedProductIds = array_column($data['product_quantities'], 'product_id');

        // Find products that have been removed in the update (present in existing but not in updated)
        $productsToDelete = array_diff($existingProductIds, $updatedProductIds);

        // Delete the removed products and log transactions
        foreach ($productsToDelete as $productId) {
            $existingStock = Stock::where('user_id', $data['user_id'])
                ->where('warehouse_id', $data['warehouse_id'])
                ->where('product_id', $productId)
                ->first();

            if ($existingStock) {
                // Log the adjustment transaction for the entire quantity
                StockTransaction::create([
                    'stock_id' => $existingStock->id,
                    'quantity' => $existingStock->quantity,
                    'transaction_type' => 'release', //We release the the deleted product from the stock but it does not mean that they will go to someone
                ]);

                // Remove the stock record
                $existingStock->delete();
            }
        }

        // Process the remaining or new products
        foreach ($data['product_quantities'] as $productData) {
            $existingStock = Stock::where('user_id', $data['user_id'])
                ->where('warehouse_id', $data['warehouse_id'])
                ->where('product_id', $productData['product_id'])
                ->first();

            if ($existingStock) {
                // Calculate the difference between the old and new quantities
                $difference = $productData['quantity'] - $existingStock->quantity;

                // Log the transaction based on the difference
                if ($difference > 0) {
                    StockTransaction::create([
                        'stock_id' => $existingStock->id,
                        'quantity' => $difference,
                        'transaction_type' => 'addition',
                    ]);
                } elseif ($difference < 0) {
                    StockTransaction::create([
                        'stock_id' => $existingStock->id,
                        'quantity' => abs($difference),
                        'transaction_type' => 'release',   //We release the difference from the stock but it does not mean that they will go to someone
                    ]);
                }

                // No direct update of quantity, balance will be recalculated
            } else {
                // If it doesn't exist, create a new stock record and log an addition transaction
                $newStock = Stock::create([
                    'user_id' => $data['user_id'],
                    'warehouse_id' => $data['warehouse_id'],
                    'product_id' => $productData['product_id'],
                    'quantity' => 0, // Initialize with 0, actual balance will be updated
                ]);

                StockTransaction::create([
                    'stock_id' => $newStock->id,
                    'quantity' => $productData['quantity'],
                    'transaction_type' => 'addition',
                ]);
            }

            // Update the balance in the stocks table
            $this->updateStockBalance($existingStock ? $existingStock->id : $newStock->id);
        }
    DB::commit();
        $message = $locale === 'ar' ? "تم تحديث المنتجات بنجاح" : "Products were updated successfully";

        return to_route('customer.stock.show', $data['user_id'])->with('success', $message);
    } catch (\Exception $e) {
        // If any exception is thrown, rollback the transaction
        DB::rollBack();

        // Handle the error (log it, show a user-friendly message, etc.)
        $errorMessage = $locale === 'ar' ? "حدث خطأ أثناء تحديث المنتجات" : "An error occurred while updating products";
        return back()->with('error', $errorMessage);
    }

    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stock $stock)
    {
        $stock->delete();

        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم حذف المنتج من المخزن بنجاح"
            : "Product was Removed From Warehouse successfully";

        return to_route('customer.stock.show', $stock->user_id)
            ->with('success', $message);

    }
}
