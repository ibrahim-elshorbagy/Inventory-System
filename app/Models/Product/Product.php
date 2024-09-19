<?php

namespace App\Models\Product;

use App\Models\Customer;
use App\Models\User;
use App\Models\Warehouse\Warehouse;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function receiveOrders()
    {
        return $this->hasMany(ReceiveOrder::class);
    }


    public function category()
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class, 'subcategory_id');
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'user_id', 'user_id');
    }

}
