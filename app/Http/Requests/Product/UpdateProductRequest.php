<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'products' => ['required', 'array'],
            'products.*.id' => ['required', 'exists:products,id'],
            'products.*.product_name' => ['required', 'string', 'max:255'],
            'products.*.purchase_price' => ['nullable', 'numeric', 'min:0'],
            'products.*.minimum_price' => ['nullable', 'numeric', 'min:0'],
            'products.*.retail_price' => ['nullable', 'numeric', 'min:0'],
            'products.*.block_price' => ['nullable', 'numeric', 'min:0'],
            'products.*.is_active' => ['required', 'boolean'],

        ];
    }
}
