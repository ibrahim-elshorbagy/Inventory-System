<?php

namespace App\Http\Resources\Admin\Orders;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class OrdereDetialsResource extends JsonResource
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
            // Order info
            'id' => $this->id,
            'description' => $this->description,
            'delivery_address' => $this->delivery_address,
            'status' => $this->status,
            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),

            // Include requests data
            'requests' => RequestProductsResource::collection($this->whenLoaded('requests')),

            // Get customer and warehouse info from the first request
            'customer_id' => $this->whenLoaded('requests', function () {
                return optional($this->requests->first()->stock->customer)->user_id;
            }),
            'customer_name' => $this->whenLoaded('requests', function () {
                return optional($this->requests->first()->stock->customer->user)->name;
            }),
            'customer_address' => $this->whenLoaded('requests', function () {
                return optional($this->requests->first()->stock->customer)->address;
            }),
             'customer_phone' => $this->whenLoaded('requests', function () {
                return optional($this->requests->first()->stock->customer)->phone;
            }),
            'warehouse_id' => $this->whenLoaded('requests', function () {
                return optional($this->requests->first()->stock->warehouse)->id;
            }),
            'warehouse_name' => $this->whenLoaded('requests', function () {
                return optional($this->requests->first()->stock->warehouse)->name;
            }),
        ];

    }
}
