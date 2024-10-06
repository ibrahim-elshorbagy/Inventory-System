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
            'user_id' => ['required', 'exists:users,id'],
            'product_quantities' => ['required', 'array', 'min:1'],
            'product_quantities.*.name' => ['required', 'string', 'max:255'],
            'product_quantities.*.quantity' => ['required', 'numeric', 'gt:0'],
            'product_quantities.*.description' => ['nullable', 'string'],
            'product_quantities.*.notes' => ['nullable', 'string'],
            'product_quantities.*.category_id' => ['required', 'exists:product_categories,id'],
            'product_quantities.*.subcategory_id' => ['required', 'exists:sub_categories,id'],
            'product_quantities.*.warehouse_id' => ['required', 'exists:warehouses,id'],
            'product_quantities.*.id' => 'nullable|exists:products,id',
            'product_quantities.*.image_url' => ['nullable','string'],
            'product_quantities.*.image_file' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,jfif'],

        ];
    }
}
