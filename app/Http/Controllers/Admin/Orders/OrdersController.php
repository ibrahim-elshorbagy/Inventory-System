<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Http\Controllers\Controller;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\StockReleaseOrder;
use App\Models\Warehouse\StockTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdersController extends Controller
{
    public function changeStatus(Request $request, StockReleaseOrder $order)
    {
        $newStatus = $request->input('status');
        $oldStatus = $order->status;
        $locale = session('app_locale', 'en');

        DB::beginTransaction();
        try {
            if ($newStatus === 'delivered' && $oldStatus !== 'delivered') {
                // Release stock when changing to delivered
                $this->releaseStock($order);
            } elseif ($oldStatus === 'delivered' && $newStatus !== 'delivered') {
                 // Revert stock release when changing from delivered to any other status
                $this->revertStockRelease($order);
            }

            // Update the order status
            $order->status = $newStatus;
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
        $stockReleaseRequests = $order->requests; //get all stock requests from the order

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

    private function revertStockRelease(StockReleaseOrder $order) //revert the stock add the stock to the customer again
    {
        $stockReleaseRequests = $order->requests;

        // Create an addition transaction to revert the release
        foreach ($stockReleaseRequests as $request) {
            $stock = Stock::findOrFail($request->stock_id);

            StockTransaction::create([
                'stock_id' => $stock->id,
                'quantity' => $request->quantity,
                'transaction_type' => 'addition',
            ]);

            // Update the stock balance
            $this->updateStockBalance($stock->id);
        }
    }

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
