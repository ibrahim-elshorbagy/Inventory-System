<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCategoryResource;
use App\Http\Resources\Product\SubCategoryResource;
use App\Models\Product\ProductCategory;
use App\Models\Product\SubCategory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SubCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = SubCategory::query()->with('category');

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        $subCategories = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);
        return inertia("Product/SubCategory/Index", [
            "subCategories" => SubCategoryResource::collection($subCategories),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $mainCategories = ProductCategory::where('is_active', 1)->get();
        return inertia("Product/SubCategory/Create",[
            'mainCategories' => $mainCategories,
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:sub_categories,name'],
            'category_id' => ['required', 'exists:product_categories,id'],
            'is_active'=>['required','boolean'],
        ]);

        $category= SubCategory::create($data);


        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم إنشاء الصنف الفرعي \"{$category->name}\" بنجاح"
            : "Sub Category \"{$category->name}\" was created successfully";

        return to_route('subCategory.index')
            ->with('success', $message);

    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SubCategory $subcategory)
    {
        $mainCategories = ProductCategory::where('is_active', 1)->get();

        return inertia('Product/SubCategory/Edit', [
            'category' => new SubCategoryResource($subcategory),
            'mainCategories' => $mainCategories
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SubCategory $subcategory)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('sub_categories')->ignore($subcategory->id, 'id')],
            'category_id' => ['required', 'exists:product_categories,id'],
            'is_active'=>['required','boolean'],

        ]);

        $subcategory->update($data);


        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? " تم تحديث الصنف الفرعي \"{$subcategory->name}\" بنجاح"
            : "Sub Category \"{$subcategory->name}\" was updated successfully";

        return to_route('subCategory.index')
            ->with('success', $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SubCategory $subcategory)
    {

        $name = $subcategory->name;
        if ($subcategory->products()->count() > 0) {
        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "لا يمكن حذف الصنف \"{$name}\" بسبب وجود منتجات مرتبطه بها"
            : "Cannot delete category \"{$name}\" because it has Products associated with it";

        return to_route('subCategory.index')
            ->with('danger', $message);
        }

        $subcategory->delete();

        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم حذف الصنف الفرعي \"{$name}\" بنجاح"
            : "Sub Category \"{$name}\" was deleted successfully";

        return to_route('subCategory.index')
            ->with('success', $message);

    }
}
