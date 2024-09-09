<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Product\Product;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateOneProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\Product\ProductResource;
use App\Models\Product\ProductBrand;
use App\Models\Product\ProductCategory;
use App\Models\Product\ProductModel;
use App\Models\Product\ProductUnit;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Product::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        $products = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Product/Product/Index", [
            "products" => ProductResource::collection($products),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = ProductCategory::where('is_active', true)->get(['id', 'name']);
        $models = ProductModel::where('is_active', true)->get(['id', 'name']);
        $brands = ProductBrand::where('is_active', true)->get(['id', 'name']);
        $units = ProductUnit::where('is_active', true)->get(['id', 'name']);

        return inertia("Product/Product/Create",[
            'categories' => $categories,
            'models' => $models,
            'brands' => $brands,
            'units' => $units,
        ]);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        $data['created_by'] = auth()->user()->id;
        $product= Product::create($data);


        $locale = session('app_locale', 'en');

        // Set the success message based on the session-stored locale
        $message = $locale === 'ar'
            ? "تم إنشاء المنتج \"{$product->name}\" بنجاح"
            : "product \"{$product->name}\" was created successfully";

        return to_route('product.index')
            ->with('success', $message);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
                $categories = ProductCategory::where('is_active', true)->get(['id', 'name']);
        $models = ProductModel::where('is_active', true)->get(['id', 'name']);
        $brands = ProductBrand::where('is_active', true)->get(['id', 'name']);
        $units = ProductUnit::where('is_active', true)->get(['id', 'name']);

        return inertia('Product/Product/Edit', [
            'product' => new ProductResource($product),
            'categories' => $categories,
            'models' => $models,
            'brands' => $brands,
            'units' => $units,

        ]);
    }


    /**
     * Update the specified resource in storage.
     */

    public function update(UpdateOneProductRequest $request,Product $product)
    {
        $data = $request->validated();

        $data['updated_by'] = auth()->user()->id;
        $product->update($data);


        $locale = session('app_locale', 'en');

        // Set the success message based on the session-stored locale
        $message = $locale === 'ar'
            ? "تم تحديث المنتج \"{$product->name}\" بنجاح"
            : "product \"{$product->name}\" was updated successfully";

        return to_route('product.index')
            ->with('success', $message);
    }
    public function bulkUpdate(UpdateProductRequest $request, Product $product)
    {

        foreach ($request->products as $productData) {
                    $product = Product::find($productData['id']);
                    // Update product fields
                    $product->update([
                        'name' => $productData['product_name'],
                        'purchase_price' => $productData['purchase_price'],
                        'minimum_price' => $productData['minimum_price'],
                        'retail_price' => $productData['retail_price'],
                        'block_price' => $productData['block_price'],
                        'is_active' => $productData['is_active'],
                        'updated_by' => auth()->user()->id,
                    ]);
                }


        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم تحديث المنتجات  بنجاح"
            : "products was updated successfully";

        return to_route('product.index')
            ->with('success', $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $name = $product->name;
        $product->delete();

        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم حذف المنتج \"{$name}\" بنجاح"
            : "product \"{$name}\" was deleted successfully";

        return to_route('product.index')
            ->with('success', $message);
    }
}
