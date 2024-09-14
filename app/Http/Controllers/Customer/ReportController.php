<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Warehouse\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\Warehouse\CustomerStockResource;

class ReportController extends Controller
{
/*

this to print any reports

*/


    public function MyProductRport(){ //report about the products the customer has on the warehouse

        $user = Auth::user();


        $query = Stock::query()
            ->where('user_id', $user->id)
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

        return inertia('Customer/MyProductReport/MyProductReport', [
            'products' => CustomerStockResource::collection($products),

        ]);
    }
}
