<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductBrandResource;
use App\Models\Product\ProductBrand;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = ProductBrand::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        $brands = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Product/ProductBrand/Index", [
            "brands" => ProductBrandResource::collection($brands),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Product/ProductBrand/Create",);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:product_brands,name'],
            'is_active'=>['required','boolean'],
        ]);

        $data['created_by'] = auth()->user()->id;
        $brand= ProductBrand::create($data);


        $locale = session('app_locale', 'en');

        // Set the success message based on the session-stored locale
        $message = $locale === 'ar'
            ? "تم إنشاء علامة تجارية \"{$brand->name}\" بنجاح"
            : "brand \"{$brand->name}\" was created successfully";

        return to_route('brand.index')
            ->with('success', $message);

    }

    /**
     * Display the specified resource.
     */
    public function show(ProductBrand $productBrand)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductBrand $brand)
    {
        return inertia('Product/ProductBrand/Edit', [
            'brand' => new ProductBrandResource($brand),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductBrand $brand)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('product_brands')->ignore($brand->id, 'id')],
            'is_active'=>['required','boolean'],

        ]);

        $data['updated_by'] = auth()->user()->id;
        $brand->update($data);


        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم تحديث العلامة التاجريه \"{$brand->name}\" بنجاح"
            : "brand \"{$brand->name}\" was updated successfully";

        return to_route('brand.index')
            ->with('success', $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductBrand $brand)
    {
        $name = $brand->name;
        $brand->delete();

        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم حذف العلامة التاجريه \"{$name}\" بنجاح"
            : "brand \"{$name}\" was deleted successfully";

        return to_route('brand.index')
            ->with('success', $message);


    }
}
