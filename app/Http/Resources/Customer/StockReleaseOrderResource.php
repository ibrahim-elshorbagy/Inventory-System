<?php

namespace App\Http\Resources\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StockReleaseOrderResource extends JsonResource
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
            'customer_id' => $this->customer_id,
            'description' => $this->description,
            'delivery_address' => $this->delivery_address,
            'status' => $this->status,
            'requests' => StockReleaseRequestResource::collection($this->whenLoaded('requests')),
        ];
    }
}
