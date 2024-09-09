<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class ProductResource extends JsonResource
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
            'name' => $this->name,
            'details' => $this->details,
            'purchase_price' => $this->purchase_price,
            'minimum_price' => $this->minimum_price,
            'retail_price' => $this->retail_price,
            'block_price' => $this->block_price,
            'is_active' => (bool)$this->is_active,
            'unit'=> $this->unit,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),

        ];
    }
}
