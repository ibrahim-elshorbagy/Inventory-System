<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;


    public $incrementing = false;
    protected $primaryKey = 'user_id';
    public $timestamps = false;


    protected $fillable = ['user_id', 'address', 'phone'];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
