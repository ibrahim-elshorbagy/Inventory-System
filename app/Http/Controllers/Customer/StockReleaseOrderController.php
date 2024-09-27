<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\ReleaseRequest\StoreStockReleaseRequestValidation;
use App\Http\Requests\Customer\ReleaseRequest\UpdateStockReleaseRequestValidation;
use App\Http\Resources\Customer\CustomerProductsResource;
use App\Http\Resources\Customer\MyOrdersResource;
use App\Http\Resources\Customer\StockReleaseOrderResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\Warehouse\CustomerStockResource;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\StockReleaseOrder;
use App\Models\Warehouse\StockReleaseRequest;
use App\Http\Resources\Admin\ReleaseOrder\OrdereDetialsResource;

use App\Models\User;
use App\Notifications\CustomerReleaseOrder\CustomerReleaseOrderNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\DB;

class StockReleaseOrderController extends Controller
{


    /*
    for the customer to make a release order updated and delete
    release order consist of tow tables
    one stock_release_orders table and other one request table
    order table consist of    {customer_id ,description,status}
    second stock_release_requests : data about the products and quantity and order_id
    */


    //To make release request

    public function MakeReleaseOrder(){
        $user = Auth::user();


        $query = Stock::query()
            ->where('user_id', $user->id)
            ->select('id', 'user_id', 'warehouse_id', 'product_id', 'quantity')
            ->with([
                'product:id,name,image_url',
                'warehouse:id,name',
            ]);

        $products = $query->orderBy('created_at', 'desc')
            ->get();

        return inertia('Customer/MyProductReport/MakeReleaseOrder', [
            'products' => CustomerProductsResource::collection($products),

        ]);

    }

    //To store release request
    public function ReleaseOrderStore(StoreStockReleaseRequestValidation $request)
    {

            DB::beginTransaction();
            try{

        $validated = $request->validated();
        $user = Auth::user();

        // Create the StockReleaseOrder
        $order = StockReleaseOrder::create([
            'created_by_user' => true,
            'customer_id' => $user->id,
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

        // Send notification to admins
        $admins = User::role(['admin', 'SystemAdmin'])->get();
        Notification::send($admins, new CustomerReleaseOrderNotification($order, $user, 'added'));

        $locale = session('app_locale', 'en');
        $message = $locale === 'ar' ? "تم اضافة الطلب بنجاح" : "Request was sent successfully";

        DB::commit();
        return redirect()->route('customer.show.my-requests')->with('success', $message);
      }
            catch (\Exception $e) {
            DB::rollBack();

            return back()->with('danger' , $e->getMessage());
        }


    }


    //To show All Customer requests

    public function MyOrders(){
        $user = Auth::user();
        $query = StockReleaseOrder::query()
            ->where('customer_id', $user->id);

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        $requests = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Customer/MyProductReport/MyOrders", [
            "requests" => MyOrdersResource::collection($requests),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);

    }

    public function EditReleaseOrder($id){
        $user = Auth::user();

        // Fetch the specific StockReleaseOrder with its requests
        $order = StockReleaseOrder::with('requests.stock')
            ->where('id', $id)
            ->where('customer_id', $user->id)
            ->firstOrFail();

        if ($order->confirmed === 'approved') {
                return redirect()->back()->with('error', 'Cannot edit the completed order');
            }
        // Fetch the user's other products in stock
        $productsInStock = Stock::where('user_id', $user->id)
            ->select('id', 'user_id', 'warehouse_id', 'product_id', 'quantity')
            ->with([
                'product:id,name,image_url',
                'warehouse:id,name',
            ])
            ->get();

        // Transform the data using Resource if needed
        $orderResource = new StockReleaseOrderResource($order); //as you here editing order that order has requests
        $productsResource = CustomerProductsResource::collection($productsInStock);

        // dd($orderResource,$productsResource);
        return inertia('Customer/MyProductReport/EditReleaseOrder', [
            'order' => $orderResource,
            'products' => $productsResource,
        ]);

    }

    public function UpdateReleaseOrder(UpdateStockReleaseRequestValidation $request, $id)
    {

            DB::beginTransaction();
            try{

        $validated = $request->validated();

        $user = Auth::user();

        // Find the existing StockReleaseOrder
        $order = StockReleaseOrder::where('id', $id)
            ->where('customer_id', $user->id)
            ->firstOrFail();
        if ($order->confirmed === 'approved') {
                return redirect()->back()->with('error', 'Cannot edit the completed order');
            }
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

        // Send notification to admins
        $admins = User::role(['admin', 'SystemAdmin'])->get();
        Notification::send($admins, new CustomerReleaseOrderNotification($order, $user, 'updated'));


        $locale = session('app_locale', 'en');
        $message = $locale === 'ar' ? "تم تحديث الطلب بنجاح" : "Request was updated successfully";
        DB::commit();

        return redirect()->route('customer.show.my-requests')->with('success', $message);
        }
                catch (\Exception $e) {
                DB::rollBack();

                return back()->with('danger' , $e->getMessage());
            }


    }


    public function destroyReleaseRequest($id)
    {
        $order = StockReleaseOrder::findOrFail($id);
        $locale = session('app_locale', 'en');
        if ($order->status !== 'pending') {
            $message = $locale === 'ar'
                ? "لا يمكن حذف الطلب. يمكن حذف الطلبات المعلقة فقط."
                : "Cannot delete the request. Only pending requests can be deleted.";

            return to_route('customer.show.my-requests')
                ->with('danger', $message);
        }

        $order->delete();

        $message = $locale === 'ar'
            ? "تم حذف طلب الاعادة بنجاح"
            : "Release Request was deleted successfully";

        return to_route('customer.show.my-requests')
            ->with('success', $message);
    }

    public function ShowMyorder($id)
    {

    $order = StockReleaseOrder::where('id', $id)->where('customer_id', Auth::user()->id)->firstOrFail();
        $order->load([
            'requests.stock.customer.user',
            'requests.stock.warehouse',
            'requests.stock.product.category',
            'requests.stock.product.subCategory'
        ])->paginate(20)->onEachSide(1);


        return inertia("Customer/MyProductReport/OrderDetails", [
            "order" => OrdereDetialsResource::make($order),
        ]);
    }
}
