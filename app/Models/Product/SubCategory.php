<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    public $timestamps = false;

    public function category()
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class,"subcategory_id",'id');
    }

}
