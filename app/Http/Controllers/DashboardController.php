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



    public function markAsRead(Request $request)
    {
        $user = Auth::user();
        $data = $request->validate([
            'url' => ['required', 'url'],
            'id' => ['required', 'exists:notifications,id']
        ]);

        $notification = $user->notifications()->where('id', $data['id'])->first();

        if ($notification) {

            $notificationData = $notification->data;

            $model = $notificationData['model'];
            $orderId = $notificationData['order_id'];

            $order = $model::find($orderId);

                if ($order) {
                    $notification->delete();
                    return redirect($data['url']);
                } else {
                    // The order doesn't exist, return an error message
                    $notification->delete();
                    $locale = session('app_locale', 'en');
                    $message = $locale === 'ar' ? "عذرا، الطلب غير موجود" : "The order is no longer available";
                    return back()->with('danger', $message);
                }

        }

        $locale = session('app_locale', 'en');
        $message = $locale === 'ar' ? "لا يوجد اشعار" : "Notification not found";
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
