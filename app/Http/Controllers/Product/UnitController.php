<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductUnitResource;
use App\Models\Product\ProductUnit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = ProductUnit::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        $units = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Product/ProductUnit/Index", [
            "units" => ProductUnitResource::collection($units),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Product/ProductUnit/Create",);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:product_units,name'],
            'is_active'=>['required','boolean'],
        ]);

        $data['created_by'] = auth()->user()->id;
        $unit= ProductUnit::create($data);


        $locale = session('app_locale', 'en');

        // Set the success message based on the session-stored locale
        $message = $locale === 'ar'
            ? "تم إنشاء الوحدة القياسيه \"{$unit->name}\" بنجاح"
            : "unit \"{$unit->name}\" was created successfully";

        return to_route('unit.index')
            ->with('success', $message);

    }

    /**
     * Display the specified resource.
     */
    public function show(ProductUnit $productUnit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductUnit $unit)
    {
        return inertia('Product/ProductUnit/Edit', [
            'unit' => new ProductUnitResource($unit),
        ]);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductUnit $unit)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('product_units')->ignore($unit->id, 'id')],
            'is_active'=>['required','boolean'],

        ]);

        $data['updated_by'] = auth()->user()->id;
        $unit->update($data);


        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم تحديث الوحدةالقياسية \"{$unit->name}\" بنجاح"
            : "unit \"{$unit->name}\" was updated successfully";

        return to_route('unit.index')
            ->with('success', $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductUnit $unit)
    {
        $name = $unit->name;
        $unit->delete();

        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم حذف الوحدةالقياسية \"{$name}\" بنجاح"
            : "unit \"{$name}\" was deleted successfully";

        return to_route('unit.index')
            ->with('success', $message);
    }
}
