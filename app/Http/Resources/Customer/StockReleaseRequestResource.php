<?php

namespace App\Http\Resources\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockReleaseRequestResource extends JsonResource
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
            'stock_release_order_id' => $this->stock_release_order_id,
            'stock_id' => $this->stock_id,
            'quantity' => $this->quantity,
            'product_name' => $this->whenLoaded('stock', fn() => $this->stock->product->name),
            'max_quantity' => $this->whenLoaded('stock', fn() => $this->stock->quantity),

        ];
    }
}
