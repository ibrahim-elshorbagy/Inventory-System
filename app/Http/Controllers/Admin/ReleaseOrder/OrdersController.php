<?php

namespace App\Http\Controllers\Admin\ReleaseOrder;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\StockReleaseOrder;
use App\Models\Warehouse\StockTransaction;
use App\Notifications\CustomerReleaseOrder\ReleaseOrderAdminConfirmForDataEntryNotification;
use App\Notifications\CustomerReleaseOrder\ReleaseOrderAdminConfirmStatusNotification;
use App\Notifications\CustomerReleaseOrder\ReleaseOrderChangeStatusNotification;
use App\Notifications\CustomerReleaseOrder\ReleaseOrderDoneNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class OrdersController extends Controller
{

    /**
     * FULL approval system + change Status System
     * change balance stock when release when only order confirmed
     * old revert code stoped
     *
     */
    // Change order status normal change

    public function changeStatus(Request $request, StockReleaseOrder $order)
    {

        $request->validate([
            'status' => ['required', 'in:pending,approved,rejected,delivered'],
            'confirmed'=>['in:pending,approved,rejected'],
            'notes'=>['nullable','string'],
        ]);

        $newStatus = $request->input('status');

        $locale = session('app_locale', 'en');


        //can't change if it is confirmed and delivered
        if($order->confirmed === 'approved' && $order->status === 'delivered'  ){
            return to_route('admin.index.orders');
        }

        //Admin change confirmed to Approved
        if(Auth::user()->hasPermissionTo('release-order-confirme') ){


            //For Approve msg
            if($order->confirmed != 'approved' && $request->input('confirmed') == 'approved'){

                    // Send notification to Customer
                    $user = User::find($order->customer_id);
                    $order = $order;
                    Notification::send($user, new ReleaseOrderAdminConfirmStatusNotification($order, $user, 'confirmed'));

                    //send notification to data entry
                    $alldataentries  = User::role(['dataEntry'])->get();
                    Notification::send($alldataentries, new ReleaseOrderAdminConfirmForDataEntryNotification($order, $user,'confirmed'));
            }
            //For Rejecet msg
            elseif($order->confirmed != 'rejected' && $request->input('confirmed') == 'rejected'){

                    // Send notification to Customer
                    $user = User::find($order->customer_id);
                    $order = $order;
                    Notification::send($user, new ReleaseOrderAdminConfirmStatusNotification($order, $user, 'rejected'));

                    //send notification to data entry
                    $alldataentries  = User::role(['dataEntry'])->get();
                    Notification::send($alldataentries, new ReleaseOrderAdminConfirmForDataEntryNotification($order, $user,'rejected'));

            }


                $order->update(['notes' => $request->input('notes')]);

                if($request->confirmed == 'rejected'){

                $order->update([
                    'confirmed' => 'rejected'
                    ,'status' => 'rejected']);
                    $message = $locale === 'ar'? "تم تحديث حالة الطلب بنجاح": "Order status updated successfully";
                    return to_route('admin.index.orders')->with('success', $message);

                }else{
                $order->update(['confirmed' => $request->confirmed]);

                }

            $order->save();



        }


        //Normal status change
        if( $order->status !== 'delivered' && $order->status !== $request->input('status')  ){

                // Send notification to customer when change status
                $order->update(['status' => $request->input('status')]);
                $user = User::find($order->customer_id);
                Notification::send($user, new ReleaseOrderChangeStatusNotification($order, $user, 'status'));

        }


        //Approve the order
        if( $order->status === "delivered" && $request->input('confirmed') == "delivered"  ){

            DB::beginTransaction();

                try{

                    $this->confirmed($order);

                    $user = User::find($order->customer_id);
                    $order = $order;
                    Notification::send($user, new ReleaseOrderDoneNotification($order, $user, $confirm));

                    DB::commit();

                }
                    catch (\Exception $e) {
                    DB::rollBack();

                    return back()->with('danger' , $e->getMessage());
                }



        }


        $message = $locale === 'ar'
            ? "تم تحديث حالة الطلب بنجاح"
            : "Order status updated successfully";
        return to_route('admin.index.orders')
        ->with('success', $message);




    }

    public function confirmed(StockReleaseOrder $order)
    {
        $locale = session('app_locale', 'en');
        DB::beginTransaction();
        try {


            $this->releaseStock($order);
            // Update the order status
            $order->confirmed = "approved";
            $order->save();

            DB::commit();

            $message = $locale === 'ar'
                ? "تم تحديث حالة الطلب بنجاح"
                : "Order status updated successfully";

            return to_route('admin.index.orders')
            ->with('success', $message);

        } catch (\Exception $e) {
            DB::rollBack();

            $errorMessage = $locale === 'ar'
                ? "حدث خطأ أثناء تحديث حالة الطلب"
                : "An error occurred while updating the order status";

            return to_route('admin.index.orders')
            ->with('danger', $errorMessage);
        }
    }

    private function releaseStock(StockReleaseOrder $order)
    {
        $stockReleaseRequests = $order->requests; //get all stock Release requests from the order

        foreach ($stockReleaseRequests as $request) { //loop through the requests and start to make new transactions
            $stock = Stock::findOrFail($request->stock_id);

            StockTransaction::create([
                'stock_id' => $stock->id,
                'quantity' => $request->quantity,
                'transaction_type' => 'release',
            ]);

            // Update the stock balance
            $this->updateStockBalance($stock->id);
        }
    }

    // private function revertStockRelease(StockReleaseOrder $order) //revert the stock add the stock to the customer again //Stoped
    // {
    //     $stockReleaseRequests = $order->requests;

    //     // Create an addition transaction to revert the release
    //     foreach ($stockReleaseRequests as $request) {
    //         $stock = Stock::findOrFail($request->stock_id);

    //         StockTransaction::create([
    //             'stock_id' => $stock->id,
    //             'quantity' => $request->quantity,
    //             'transaction_type' => 'addition',
    //         ]);

    //         // Update the stock balance
    //         $this->updateStockBalance($stock->id);
    //     }
    // }

    private function updateStockBalance($stockId)
    {
        $stock = Stock::findOrFail($stockId); //get the right stock
        $transactions = StockTransaction::where('stock_id', $stock->id)->get();//get all transactions

        $balance = 0;//initialize balance
        foreach ($transactions as $transaction) { //start to calc the blance for that stock
            if ($transaction->transaction_type === 'addition') {
                $balance += $transaction->quantity;
            } else {
                $balance -= $transaction->quantity;
            }
        }

        $stock->quantity = $balance;
        $stock->save();
    }
}
