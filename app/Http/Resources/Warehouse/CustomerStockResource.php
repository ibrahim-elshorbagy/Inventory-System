<?php

namespace App\Http\Resources\Warehouse;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class CustomerStockResource extends JsonResource
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
            'warehouse_id' =>  $this->whenLoaded('warehouse',function(){return $this->warehouse->id;}),
            'warehouse_name' =>  $this->whenLoaded('warehouse',function(){return $this->warehouse->name;}),

            'product_id' =>  $this->whenLoaded('product',function(){return $this->product->id;}),
            'product_name' =>  $this->whenLoaded('product',function(){return $this->product->name;}),
            'product_image' =>  $this->whenLoaded('product',function(){return $this->product->image_url;}),
            'product_description' =>  $this->whenLoaded('product',function(){return $this->product->description;}),
            'product_notes' =>  $this->whenLoaded('product',function(){return $this->product->notes;}),

            'category_id' =>  $this->whenLoaded('product',function(){return $this->product->category->id;}),
            'category_name' =>  $this->whenLoaded('product',function(){return $this->product->category->name;}),

            'subcategory_id' =>  $this->whenLoaded('product',function(){return $this->product->subCategory->id;}),
            'subcategory_name' =>  $this->whenLoaded('product',function(){return $this->product->subCategory->name;}),

            'quantity' => $this->quantity,

            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),

        ];
    }
}
