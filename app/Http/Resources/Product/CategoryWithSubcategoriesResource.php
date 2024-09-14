<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryWithSubcategoriesResource extends JsonResource
{
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
            'subcategories' => $this->whenLoaded('subCategories', function () {
                return $this->subCategories->map(function ($subCategory) {
                    return [
                        'id' => $subCategory->id,
                        'name' => $subCategory->name,
                    ];
                });
            }),

        ];
    }
}
