<?php

namespace App\Models\Warehouse;

use App\Models\Customer;
use App\Models\Product\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $guarded = [];


    public function customer()
    {
        return $this->belongsTo(Customer::class, 'user_id', 'user_id');
    }


    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }


    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
