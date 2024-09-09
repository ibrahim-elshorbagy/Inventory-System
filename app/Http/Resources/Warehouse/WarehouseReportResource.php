<?php

namespace App\Http\Resources\Warehouse;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class WarehouseReportResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,
            // 'warehouse_id' =>  $this->whenLoaded('warehouse',function(){return $this->warehouse->id;}),
            // 'warehouse_name' =>  $this->whenLoaded('warehouse',function(){return $this->warehouse->name;}),

            'product_id' =>  $this->whenLoaded('product',function(){return $this->product->id;}),
            'product_name' =>  $this->whenLoaded('product',function(){return $this->product->name;}),

            'quantity' => $this->quantity,

            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),

            'user_id' =>  $this->whenLoaded('customer',function(){return $this->customer->user->id;}),
            'user_name' =>  $this->whenLoaded('customer',function(){return $this->customer->user->name;}),

            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),

        ];
    }
}
