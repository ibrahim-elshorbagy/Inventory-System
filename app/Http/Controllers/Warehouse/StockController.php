<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Product\Product;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\Warehouse;
use Illuminate\Http\Request;
use App\Http\Resources\Warehouse\CustomerStockResource;
use App\Models\Product\ProductCategory;
use App\Models\Warehouse\StockTransaction;
use App\Http\Requests\Product\ReceiveProductRequest;
use App\Http\Resources\Product\ProductOrderDetailsResource;
use App\Http\Resources\Product\ProductOrdersResource;
use App\Models\Product\ReceiveOrder;
use Illuminate\Support\Facades\Storage;

use App\Models\User;
use App\Notifications\AdditionOrder\AdditionOrderChangeStatusNotification;
use App\Notifications\AdditionOrder\AdditionOrderNotification;
use App\Notifications\AdditionOrder\MyAdditionOrderChangeStatusNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

//Create Additions order controller
class StockController extends Controller
{

    /**
     * Show Add Form for making new adding order for Customer.
     */
    public function addPage(Customer $customer)
    {

            $customer->load(['user:id,name']);

            $categories = ProductCategory::with(['subCategories' => function ($query) {
                $query->where('is_active', true)->select('id', 'name', 'category_id');
            }])->where('is_active', true)->get();

            $warehouses = Warehouse::query()->where('is_active', 1)->select('id', 'name')->get();

            return inertia("Warehouses/Stock/CreateOrder",
            [
                'customer' => $customer,
                'warehouses' => $warehouses,
                'categories' => $categories
            ]
        );

    }

    /**
     * Added products to order and wait for admin approved.
     */
    public function addProduct(ReceiveProductRequest $request)
    {
            $data = $request->validated();


            DB::beginTransaction();
            try{



            // Create the receive order
            $receiveOrder = ReceiveOrder::create([
                'user_id' => $data['user_id'],
                'status' => 'pending',
            ]);

            // Iterate over the product quantities
            foreach ($data['product_quantities'] as $productData) {

                // Handle the image upload
                if (isset($productData['image_url']) && $productData['image_url']->isValid()) {
                    // Generate the path: userid/orderid/
                    $path = 'uploads/' . $data['user_id'] . '/' . $receiveOrder->id;

                    // Get the original file name and store the image
                    $imageName = $productData['image_url']->getClientOriginalName();
                    $imagePath = $productData['image_url']->storeAs($path, $imageName, 'public');

                    // Use Storage::url() to generate the full image URL
                    $imageUrl = Storage::url($imagePath); // No need to manually add /storage/
                }
                else {
                    // No image provided, store null
                    $imageUrl = 'https://cdn-icons-png.flaticon.com/512/13271/13271401.png';
                }

                // Create a product record
                Product::create([
                    'receive_order_id' => $receiveOrder->id,

                    'name' => $productData['name'],
                    'quantity' => $productData['quantity'],
                    'description' => $productData['description'],
                    'notes' => $productData['notes'],
                    'image_url' => $imageUrl, // Save the image URL

                    'category_id' => $productData['category_id'],
                    'subcategory_id' => $productData['subcategory_id'],

                    'user_id' => $data['user_id'],
                    'warehouse_id' => $productData['warehouse_id'],

                ]);
            }

            // Send notification to admins
            $admins = User::role(['admin', 'SystemAdmin'])->get();
            $user = User::find($data['user_id']);
            $order = $receiveOrder;
            Notification::send($admins, new AdditionOrderNotification($order, $user, 'added'));



            $locale = session('app_locale', 'en');
            $message = $locale === 'ar' ? "تم اضافة المنتجات بنجاح" : "Products were added successfully";

            DB::commit();

            return to_route('stock.customer.orders', $data['user_id'])->with('success', $message);
        }
            catch (\Exception $e) {
            DB::rollBack();

            return back()->with('danger' , $e->getMessage());
        }
    }


    /**
     * Show ALL Orders for all customers
     */

    public function ShowAllOrders(){

        $orders = ReceiveOrder::orderBy('created_at', 'desc')
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Warehouses/Stock/CustomerOrders', [
            'orders' => ProductOrdersResource::collection($orders),
            'success'=> session('success')
        ]);

    }


    /**
     * Show ALL Orders for one customer
     */

    public function ShowOrders(Customer $customer)
    {
        $customerInfo = $customer->user->only('id', 'name', 'email');

        $orders = ReceiveOrder::where('user_id', $customer->user_id)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->onEachSide(1);

        return inertia('Warehouses/Stock/CustomerOrders', [
            'orders' => ProductOrdersResource::collection($orders),
            'user' => $customerInfo,
            'success'=> session('success')
        ]);
    }

    /**
     *  Show Detailed for a single order
     *  so he can change status of the order
     */

    public function ShowOrderDetails(ReceiveOrder $order){

        $products = Product::where('receive_order_id', $order->id)->with('category', 'subcategory', 'warehouse','user.customer')->paginate(10)->onEachSide(1);

        return inertia('Warehouses/Stock/OrderDetails', [
            'products' => ProductOrderDetailsResource::collection($products),
            "order" => $order
        ]);
    }



    /**
     *  Update the order Page
     */
    public function EditOrderPage(ReceiveOrder $order){

            if($order->status !== 'pending')
            {return redirect()->back()->with('error', 'You Cant Edit This Order');}

            $products = Product::where('receive_order_id', $order->id)->with('category', 'subcategory', 'warehouse','user.customer')->paginate(10)->onEachSide(1);

            $warehouses = Warehouse::query()->where('is_active', 1)->select('id', 'name')->get();

            $categories = ProductCategory::with(['subCategories' => function ($query) {
                $query->where('is_active', true)->select('id', 'name', 'category_id');
            }])->where('is_active', true)->get();

            return inertia("Warehouses/Stock/EditOrder",
            [
                'warehouses' => $warehouses,
                'products' => ProductOrderDetailsResource::collection($products),
                'categories' => $categories,
                'order' => $order,
            ]
        );
    }

    /**
     *  Update the order
     */
    public function updateOrder(ReceiveProductRequest $request, $orderId)
    {
        $data = $request->validated();

        DB::beginTransaction();
        try{

        // Retrieve the existing order
        $existingOrder = ReceiveOrder::findOrFail($orderId);

        // Get existing product IDs
        $existingProductIds = $existingOrder->products->pluck('id')->toArray();

        // Track product IDs that are updated or created
        $updatedProductIds = [];

        // Iterate over the product quantities
        foreach ($data['product_quantities'] as $productData) {
            // Handle the image upload
            if (isset($productData['image_url']) && !is_string($productData['image_url'])) {
                // Generate the path: userid/orderid/
                $path = 'uploads/' . $data['user_id'] . '/' . $existingOrder->id;

                // Get the original file name and store the image
                $imageName = $productData['image_url']->getClientOriginalName();
                $imagePath = $productData['image_url']->storeAs($path, $imageName, 'public');

                // Use Storage::url() to generate the full image URL
                $imageUrl = Storage::url($imagePath);
            }
            else {
                // No new image provided, keep the existing image URL or set to null
                $imageUrl = $productData['image_url'] ?? 'https://cdn-icons-png.flaticon.com/512/13271/13271401.png';
            }

            // Update or create the product
            $product = Product::updateOrCreate(
                ['id' => $productData['id'] ?? null],
                [
                    'receive_order_id' => $existingOrder->id,
                    'name' => $productData['name'],
                    'quantity' => $productData['quantity'],
                    'description' => $productData['description'],
                    'notes' => $productData['notes'],
                    'image_url' => $imageUrl,
                    'category_id' => $productData['category_id'],
                    'subcategory_id' => $productData['subcategory_id'],
                    'user_id' => $data['user_id'],
                    'warehouse_id' => $productData['warehouse_id'],
                ]
            );

            $updatedProductIds[] = $product->id;
        }

        // Delete products that were not updated or created
        $productsToDelete = array_diff($existingProductIds, $updatedProductIds);
        foreach ($productsToDelete as $productId) {
            $product = Product::find($productId);
            if ($product) {
                // Delete image from storage if it exists
                if ($product->image_url) {
                    $imagePath = str_replace('/storage/', '', $product->image_url);
                    if (Storage::disk('public')->exists($imagePath)) {
                        Storage::disk('public')->delete($imagePath);
                    }
                }
                $product->delete();
            }
        }

        // Send notification to admins
        $admins = User::role(['admin', 'SystemAdmin'])->get();
        $user = User::find($existingOrder->user_id);
        $order = $existingOrder;
        Notification::send($admins, new AdditionOrderNotification($order, $user, 'updated'));


        $locale = session('app_locale', 'en');
        $message = $locale === 'ar' ? "تم تحديث المنتجات بنجاح" : "Products were updated successfully";

        return to_route('stock.all.orders')->with('success', $message);

        }
            catch (\Exception $e) {
            DB::rollBack();

            return back()->with('danger' , $e->getMessage());
        }
    }


    /**
     *  Destroy the order
     */
    public function destroyOrder(ReceiveOrder $order)
    {
        if($order->status === 'approved'){
            return redirect()->back()->with('error', 'You Can\'t Delete This Order');
        }

        // Define the folder path where the specific order's images are stored
        $imageFolderPath = 'uploads/' . $order->user_id . '/' . $order->id;

        // Check if the folder exists, then delete the entire folder for that order
        if (Storage::disk('public')->exists($imageFolderPath)) {
            Storage::disk('public')->deleteDirectory($imageFolderPath);
        }

        $order->delete();

        $locale = session('app_locale', 'en');
        $message = $locale === 'ar' ? "تم حذف الطلب بنجاح" : "Order was deleted successfully";

        return to_route('stock.all.orders')->with('success', $message);
    }

    /**
     *  change status of the order
     */
    public function ChangeStatus(Request $request,ReceiveOrder $order){

        $data = $request->validate([
            'status' => ['required', 'in:pending,approved,rejected'],
            "description" => ['nullable', 'string'],
        ]);
        DB::beginTransaction();
        try{

        if ($order->status === 'approved') {
        return redirect()->back()->with('error', 'You can\'t change the status of this order');
        }

        $newStatus = $request->status;
        $order->update(['status' => $newStatus, 'description' => $data['description']]);

        if ($newStatus === 'approved') {
            foreach ($order->products as $product) {
                // Create a new stock record
                $stock = Stock::create([
                    'user_id' => $order->user_id,
                    'warehouse_id' => $product->warehouse_id,
                    'product_id' => $product->id,
                    'quantity' => $product->quantity,
                ]);

                // Record the transaction in the stock_transactions table
                StockTransaction::create([
                    'stock_id' => $stock->id,
                    'quantity' => $product->quantity,
                    'transaction_type' => 'addition',
                ]);
            }
        }

            if($order->status === 'approved') {
            // Send notification to alldataentries to tell them status change

            $alldataentries  = User::role(['dataEntry'])->get();
            $user = User::find($order->user_id);
            $order = $order;
            Notification::send($alldataentries, new AdditionOrderChangeStatusNotification($order, $user, 'approved'));

            //send it to customer
            Notification::send($user, new MyAdditionOrderChangeStatusNotification($order, $user, 'approved'));

            }
            if($order->status === 'rejected') {

            // Send notification to cutsomer to tell him status change
            $alldataentries  = User::role(['dataEntry'])->get();

            $user = User::find($order->user_id);

            $order = $order;

            Notification::send($alldataentries, new AdditionOrderChangeStatusNotification($order, $user, 'rejected'));

            }



            DB::commit();



        $locale = session('app_locale', 'en');
        $message = $locale === 'ar' ? "تم تحديث حالة الطلب بنجاح" : "Order status was updated successfully";

        return to_route('stock.all.orders', $order->user_id)->with('success', $message);
         }
            catch (\Exception $e) {
            DB::rollBack();

            return back()->with('danger' , $e->getMessage());
        }

    }




    /**
     * Show Cusomter Stock Report.
     */
    public function showStock(Customer $customer)
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
                'warehouse:id,name',

                'product:id,name,image_url,category_id,subcategory_id',
                'product.category:id,name',
                'product.subCategory:id,name',
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
                'warehouse:id,name',

                'product:id,name,image_url,category_id,subcategory_id',
                'product.category:id,name',
                'product.subCategory:id,name',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Warehouses/Stock/PrintCustomerStock', [
            'products' => CustomerStockResource::collection($products),
            'user' => $customerInfo,
        ]);
    }


}
