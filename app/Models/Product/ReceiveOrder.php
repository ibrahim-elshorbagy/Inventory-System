<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReceiveOrder extends Model
{
    use HasFactory;
    protected $guarded = ['id'];

    public function products(){
        return $this->hasMany(Product::class,'receive_order_id','id');
    }

}
