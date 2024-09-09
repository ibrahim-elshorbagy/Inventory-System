<?php

namespace App\Http\Requests\Product;
use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOneProductRequest extends FormRequest
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
        $product = $this->route("product");

        return [
            'name' => ['required', 'string', 'max:255',Rule::unique('products', 'name')->ignore($product->id)],
            'is_active' => ['required', 'boolean'],
            'details' => ['nullable', 'string', 'max:1000'],
            'unit' => ['nullable', 'string'],
        ];
    }
}
