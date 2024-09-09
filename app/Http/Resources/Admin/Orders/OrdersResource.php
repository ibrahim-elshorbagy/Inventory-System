<?php

namespace App\Http\Resources\Admin\Orders;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class OrdersResource extends JsonResource
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
            'description' => $this->description,
            'customer_id' => $this->whenLoaded('customer', fn() => $this->customer->user->id),
            'customer_name' => $this->whenLoaded('customer', fn() => $this->customer->user->name),
            'delivery_address' => $this->delivery_address,
            'status' => $this->status,

            // 'is_created_by_admin' => $this->createdBy ? $this->createdBy->hasAnyRole(['admin', 'SystemAdmin']) : false,
            'is_created_by_admin' => $this->createdBy ? $this->createdBy->hasAnyRole(['admin', 'SystemAdmin']) : false,

            'created_at' => (new Carbon($this->created_at))->format('Y-m-d'),
            'updated_at' => (new Carbon($this->updated_at))->format('Y-m-d'),
            ];
    }
}
