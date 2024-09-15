<?php

namespace App\Http\Controllers\Admin\ReleaseOrder;

use App\Http\Controllers\Controller;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\StockReleaseOrder;
use App\Models\Warehouse\StockTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
        ]);

        $newStatus = $request->input('status');

        $locale = session('app_locale', 'en');


        //can't change if it is confirmed
        if($order->confirmed === 'approved' ){
            return to_route('admin.index.orders');
        }

        // Update the order status
        $order->status = $newStatus;
        $order->save();


        //change to approved
        if(Auth::user()->hasPermissionTo('release-order-confirme') && $order->status === "delivered" && $request->input('confirmed') == "approved"  ){

                $this->confirmed($order);

        }

        //change to rejected or pending
        if(Auth::user()->hasPermissionTo('release-order-confirme') && $order->status !== "delivered" && $request->input('confirmed') !== "approved"  ){

            $order->confirmed = $request->input('confirmed');
            $order->save();


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
