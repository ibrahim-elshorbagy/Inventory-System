<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;

use App\Models\Product\ReceiveOrder;
use App\Models\User;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\StockReleaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class DashboardController extends Controller
{
    public function changeLanguage(Request $request)
    {
        $language = $request->input('language');

        if (in_array($language, ['en', 'ar'])) {

            session(['app_locale' => $language]);


        }

        return back();
    }

    protected $orderModels = [
        'addition-order' =>Stock::class,
        'release-orders' => StockReleaseOrder::class,
    ];
    
    public function markAsRead(Request $request)
    {
        $user = Auth::user();
        $data = $request->validate(['url' => ['required'], 'id' => ['required']]);

        // Extract path and ID from URL
        $pathSegments = explode('/', parse_url($data['url'], PHP_URL_PATH));
        $type = $pathSegments[2] ?? null;
        $orderId = $pathSegments[3] ?? null;

        // Find the model class for this type of order
        $modelClass = $this->orderModels[$type] ?? null;

        if ($modelClass && $modelClass::find($orderId)) {
            $notification = $user->notifications()->where('id', $data['id'])->first();
            if ($notification) {
                $notification->delete();
            }
            return redirect($data['url']);
        }

        // Return an error if the order does not exist
        $locale = session('app_locale', 'en');
        $message = $locale === 'ar' ? "عذرا، الرابط غير متاح" : "The link is no longer accessible";

        $notification = $user->notifications()->where('id', $data['id'])->first();
            if ($notification) {
                $notification->delete();
            }
        return back()->with('danger', $message);
    }




    public function AdminDashboard()
    {
        // Counting Admin and System Admin users
        $adminsAndSystemAdminsCount = User::role(['admin', 'SystemAdmin'])->count();

        // Counting Customers
        $customersCount = User::role('customer')->count();

        // Counting Stock Release Orders with status 'pending' or 'approved'
        $releaseOrdersCount = StockReleaseOrder::whereIn('status', ['pending', 'approved'])->count();
        $AdditionOrdersCount  =ReceiveOrder::where('status','pending')->count();
        $ordersCount = $releaseOrdersCount + $AdditionOrdersCount;

        // Counting Delivered Stock Release Orders
        $approvedAdditionOrdersCount  =ReceiveOrder::where('status','approved')->count();
        $deliveredreleasedOrdersCount = StockReleaseOrder::where('status', 'delivered')->count();
        $deliveredOrdersCount = $deliveredreleasedOrdersCount + $approvedAdditionOrdersCount;

        // Passing data to the frontend
        return inertia('Admin/Dashboard', [
            'adminsAndSystemAdminsCount' => $adminsAndSystemAdminsCount,
            'customersCount' => $customersCount,
            'ordersCount' => $ordersCount,
            'deliveredOrdersCount' => $deliveredOrdersCount,
        ]);
    }






    public function CustomerDashboard()
    {
        $userId = auth()->id();

        $productsCount = Stock::where('user_id', $userId)->sum('quantity');

        $ordersCount = StockReleaseOrder::where('customer_id', $userId)->whereIn('status', ['pending', 'approved'])->count();

        $deliveredOrdersCount = StockReleaseOrder::where('customer_id', $userId)->where('status', 'delivered')->count();

        return inertia('Customer/Dashboard',[
            'productsCount' => $productsCount,
            'ordersCount' => $ordersCount,
            'deliveredOrdersCount' => $deliveredOrdersCount,
        ]);
    }



}
