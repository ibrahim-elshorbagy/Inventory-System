<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Http\Controllers\Controller;
use App\Http\Resources\Warehouse\CustomerStockResource;
use App\Http\Resources\Customer\StockReleaseOrderResource;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\StockReleaseOrder;
use App\Models\Warehouse\StockReleaseRequest;
use App\Http\Requests\Customer\ReleaseRequest\StoreStockReleaseRequestValidation;
use App\Http\Requests\Customer\ReleaseRequest\UpdateStockReleaseRequestValidation;


class OrdersCRUDController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Customer $customer)
    {

        $customer = Customer::with(['user:id,name'])->findOrFail($customer->user_id);

        $products = Stock::query()
            ->where('user_id', $customer->user_id)
            ->select('id', 'user_id', 'warehouse_id', 'product_id', 'quantity')
            ->with([
                'product:id,name,unit',
                'warehouse:id,name',
            ]) ->get();

        return inertia('Admin/Orders/CRUD/Create', [
            'products' => CustomerStockResource::collection($products),
            'customer' => $customer,
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStockReleaseRequestValidation $request)
    {
        $validated = $request->validated();
        $request->validate([
            'customer_id' => ['required', 'exists:users,id']
        ]);
        $user = Auth::user();
        // Create the StockReleaseOrder
        $order = StockReleaseOrder::create([
            'customer_id' => $request->customer_id,
            'created_by' => $user->id,
            'description' => $validated['description'] ?? '',
            'delivery_address' => $validated['delivery_address'] ?? '',
        ]);

        // Create related StockReleaseRequests
        foreach ($validated['product_quantities'] as $product) {
            // Only create a StockReleaseRequest if the quantity is provided and valid
            if (!empty($product['quantity'])) {
                StockReleaseRequest::create([
                    'stock_release_order_id' => $order->id,
                    'stock_id' => $product['stock_id'],
                    'quantity' => $product['quantity'],
                ]);
            }
        }

        $locale = session('app_locale', 'en');
        $message = $locale === 'ar' ? "تم اضافة الطلب بنجاح" : "Request was sent successfully";

        return redirect()->route('admin.index.orders')->with('success', $message);

    }

    /**
     * Display the specified resource.
     */
    public function show(StockReleaseOrder $stockReleaseOrder)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($customerId,$orderId)
    {
        $user = Auth::user();
            // Fetch the specific StockReleaseOrder with its requests
            $order = StockReleaseOrder::with('requests.stock')
                ->where('id', $orderId)
                ->where('customer_id', $customerId)
                ->firstOrFail();

            // Fetch the user's other products in stock
            $productsInStock = Stock::where('user_id', $customerId)
                ->select('id', 'user_id', 'warehouse_id', 'product_id', 'quantity')
                ->with([
                    'product:id,name,unit',
                    'warehouse:id,name',
                ])
                ->get();

            // Transform the data using Resource if needed
            $orderResource = new StockReleaseOrderResource($order);//as you here editing order that order has requests
            $productsResource = CustomerStockResource::collection($productsInStock);

            // dd($orderResource,$productsResource);
            return inertia('Admin/Orders/CRUD/Edit', [
                'order' => $orderResource,
                'products' => $productsResource,
            ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStockReleaseRequestValidation $request, $id)
    {
        $validated = $request->validated();

        $request->validate([
            'customer_id' => ['required', 'exists:users,id']
        ]);
        $customerId = $request->customer_id;

        // Find the existing StockReleaseOrder
        $order = StockReleaseOrder::where('id', $id)
            ->where('customer_id', $customerId)
            ->firstOrFail();

        // Update the StockReleaseOrder
        $order->update([
            'description' => $validated['description'] ?? '',
            'delivery_address' => $validated['delivery_address'] ?? '',
        ]);

        // Clear out the existing StockReleaseRequests for this order
        $order->requests()->delete();

        // Create the updated StockReleaseRequests
        foreach ($validated['product_quantities'] as $product) {
            if (!empty($product['quantity'])) {
                StockReleaseRequest::create([
                    'stock_release_order_id' => $order->id,
                    'stock_id' => $product['stock_id'],
                    'quantity' => $product['quantity'],
                ]);
            }
        }

        $locale = session('app_locale', 'en');
        $message = $locale === 'ar' ? "تم تحديث الطلب بنجاح" : "Request was updated successfully";

        return redirect()->route('admin.index.orders')->with('success', $message);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockReleaseOrder $order)
    {
        $locale = session('app_locale', 'en');
        if ($order->status !== 'pending') {
            $message = $locale === 'ar'
                ? "لا يمكن حذف الطلب. يمكن حذف الطلبات المعلقة فقط."
                : "Cannot delete the request. Only pending requests can be deleted.";

            return to_route('admin.index.orders')
                ->with('danger', $message);
        }

        $order->delete();

        $message = $locale === 'ar'
            ? "تم حذف طلب الاعادة بنجاح"
            : "Release Request was deleted successfully";

        return to_route('admin.index.orders')
            ->with('success', $message);
    }
}
