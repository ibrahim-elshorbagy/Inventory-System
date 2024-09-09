<?php

namespace App\Http\Requests\Customer\ReleaseRequest;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use App\Models\Warehouse\StockReleaseOrder;

class UpdateStockReleaseRequestValidation extends FormRequest
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
        $order = StockReleaseOrder::findOrFail($this->route('id'));

        if ($order->status !== 'pending') {
            throw ValidationException::withMessages([
                'status' => ['This Order Cannot Be Edited Because its status is not pending.']
            ]);
        }
                return [
            'description' => 'nullable|string',
            'delivery_address' => 'required|string',
            'product_quantities' => 'required|array|min:1',
            'product_quantities.*.stock_id' => 'required|exists:stocks,id',
            'product_quantities.*.quantity' => [
                'nullable',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) {
                    // Validation to ensure the user has enough stock
                    $productIndex = explode('.', $attribute)[1];
                    $stockId = request('product_quantities')[$productIndex]['stock_id'];
                    $stock = \App\Models\Warehouse\Stock::find($stockId);

                    if ($stock && $value > $stock->quantity) {
                        $fail('The quantity requested exceeds the available stock.');
                    }
                }
            ],
        ];
    }
}
