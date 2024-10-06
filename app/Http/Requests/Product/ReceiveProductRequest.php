<?php
namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class ReceiveProductRequest extends FormRequest
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
            'product_quantities.*.id' => 'sometimes|exists:products,id',
            'product_quantities.*.image_url' => ['nullable', 'image', 'mimes:jpeg,jpg,png,gif,jfif'],



        ];
    }

    /**
     * Customize the name of the attributes for better readability.
     *
     * @return array
     */
    public function attributes(): array
    {
        return [
            'product_quantities.*.name' => 'Product name at row :position',
            'product_quantities.*.quantity' => 'Quantity at row :position',
            'product_quantities.*.category_id' => 'Category at row :position',
            'product_quantities.*.subcategory_id' => 'Subcategory at row :position',
            'product_quantities.*.warehouse_id' => 'Warehouse at row :position',
        ];
    }

    /**
     * Modify the default messages for specific rules.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'product_quantities.*.name.required' => 'The product name is required at row :position.',
            'product_quantities.*.quantity.required' => 'The quantity is required at row :position.',
            'product_quantities.*.category_id.required' => 'The category is required at row :position.',
            'product_quantities.*.subcategory_id.required' => 'The subcategory is required at row :position.',
            'product_quantities.*.warehouse_id.required' => 'The warehouse is required at row :position.',
        ];
    }

    /**
     * Replace placeholders in validation messages.
     *
     * @return array
     */
    public function validationData(): array
    {
        $data = parent::validationData();

        // Loop through the product_quantities and add position (index + 1) to each one
        if (isset($data['product_quantities']) && is_array($data['product_quantities'])) {
            foreach ($data['product_quantities'] as $index => $value) {
                foreach ($value as $key => $val) {
                    $data['product_quantities'][$index][$key . '_position'] = $index + 1;
                }
            }
        }

        return $data;
    }
}
