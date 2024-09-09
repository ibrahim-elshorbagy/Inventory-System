<?php

namespace App\Models\Warehouse;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockReleaseOrder extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

        public function requests()
    {
        return $this->hasMany(StockReleaseRequest::class, 'stock_release_order_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    
}
