<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCategoryResource;
use App\Models\Product\ProductCategory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = ProductCategory::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        $productCategories = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Product/ProductCategory/Index", [
            "categories" => ProductCategoryResource::collection($productCategories),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Product/ProductCategory/Create",);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:product_categories,name'],
            'is_active'=>['required','boolean'],
        ]);

        $data['created_by'] = auth()->user()->id;
        $category= ProductCategory::create($data);


        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم إنشاء الفئه \"{$category->name}\" بنجاح"
            : "Category \"{$category->name}\" was created successfully";

        return to_route('category.index')
            ->with('success', $message);

    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCategory $productCategory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductCategory $category)
    {
        return inertia('Product/ProductCategory/Edit', [
            'category' => new ProductCategoryResource($category),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductCategory $category)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('product_categories')->ignore($category->id, 'id')],
            'is_active'=>['required','boolean'],

        ]);

        $data['updated_by'] = auth()->user()->id;
        $category->update($data);


        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم تحديث الفئه \"{$category->name}\" بنجاح"
            : "Category \"{$category->name}\" was updated successfully";

        return to_route('category.index')
            ->with('success', $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $category)
    {

        $name = $category->name;
        $category->delete();

        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم حذف الفئه \"{$name}\" بنجاح"
            : "Category \"{$name}\" was deleted successfully";

        return to_route('category.index')
            ->with('success', $message);

    }
}
