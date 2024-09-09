<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductModelResource;
use App\Models\Product\ProductModel;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ModelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = ProductModel::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        $models = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Product/ProductModel/Index", [
            "models" => ProductModelResource::collection($models),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Product/ProductModel/Create",);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
          $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:product_models,name'],
            'is_active'=>['required','boolean'],
        ]);

        $data['created_by'] = auth()->user()->id;
        $model= ProductModel::create($data);


        $locale = session('app_locale', 'en');

        // Set the success message based on the session-stored locale
        $message = $locale === 'ar'
            ? "تم إنشاء النموذج \"{$model->name}\" بنجاح"
            : "model \"{$model->name}\" was created successfully";

        return to_route('model.index')
            ->with('success', $message);

    }

    /**
     * Display the specified resource.
     */
    public function show(ProductModel $productModel)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductModel $model)
    {
        return inertia('Product/ProductModel/Edit', [
            'model' => new ProductModelResource($model),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProductModel $model)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('product_models')->ignore($model->id, 'id')],
            'is_active'=>['required','boolean'],

        ]);

        $data['updated_by'] = auth()->user()->id;
        $model->update($data);


        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم تحديث النموذج \"{$model->name}\" بنجاح"
            : "model \"{$model->name}\" was updated successfully";

        return to_route('model.index')
            ->with('success', $message);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductModel $model)
    {
        $name = $model->name;
        $model->delete();

        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم حذف النموذج \"{$name}\" بنجاح"
            : "model \"{$name}\" was deleted successfully";

        return to_route('model.index')
            ->with('success', $message);

    }
}
