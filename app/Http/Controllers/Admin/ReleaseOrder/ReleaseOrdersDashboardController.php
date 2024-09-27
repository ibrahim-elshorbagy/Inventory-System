<?php

namespace App\Http\Controllers\Admin\ReleaseOrder;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ReleaseOrder\OrdersResource;
use App\Http\Resources\Admin\ReleaseOrder\OrdereDetialsResource;
use App\Models\Warehouse\StockReleaseOrder;
use Illuminate\Http\Request;

class ReleaseOrdersDashboardController extends Controller
{


    /**
     * indexing all Release Orders
     * Show Order Detials
     */



    //indexing all Release Orders
    public function index()
    {
        $query = StockReleaseOrder::query()->with('customer.user');

        if (request("customer_name")) {
            $query->whereHas('customer.user', function($q) {
                $q->where("name", "like", "%" . request("customer_name") . "%");
            });
        }
        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        $orders = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Admin/ReleaseOrder/Orders", [
            "orders" => OrdersResource::collection($orders),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);

    }

    //showing Release Order  details
    public function show(StockReleaseOrder $order)
    {

        $order->load([
            'requests.stock.customer.user',
            'requests.stock.warehouse',
            'requests.stock.product.category',
            'requests.stock.product.subCategory'
        ])->paginate(20)->onEachSide(1);


        return inertia("Admin/ReleaseOrder/OrderDetails", [
            "order" => OrdereDetialsResource::make($order),
            'danger' => session('danger'),

        ]);
    }

}
