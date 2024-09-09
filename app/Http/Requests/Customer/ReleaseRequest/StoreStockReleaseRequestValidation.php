<?php

namespace App\Http\Requests\Customer\ReleaseRequest;

use App\Models\Warehouse\Stock;
use Illuminate\Foundation\Http\FormRequest;

class StoreStockReleaseRequestValidation extends FormRequest
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
            'description' => 'required|string',
            "delivery_address"=>"required|string",
            'product_quantities' => 'required|array|min:1',
            'product_quantities.*.stock_id' => [
                'required',
                'exists:stocks,id',
            ],
            'product_quantities.*.quantity' => [
                'nullable',
                'numeric',
                'min:1',
                function ($attribute, $value, $fail) {
                    $index = explode('.', $attribute)[1];
                    $stockId = $this->product_quantities[$index]['stock_id'];

                    // Get the stock record to check available quantity
                    $stock = Stock::find($stockId);

                    if ($stock && $value > $stock->quantity) {
                        $fail("The requested quantity of {$value} exceeds the available stock of {$stock->quantity} for this product.");
                    }
                },
            ],
        ];
    }
}
