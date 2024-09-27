<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use App\Http\Resources\Warehouse\WarehouseResource;
use App\Http\Resources\Warehouse\WarehouseReportResource;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;


class WarehouseController extends Controller
{
    /*

    Full (Add Update Delete) for Warehouses
    Show for showing the warehouse peroducts for every customer.
    */



    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Warehouse::query();

        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        $warehouses = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Warehouses/Warehouses/Index", [
            "warehouses" => WarehouseResource::collection($warehouses),
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
        return inertia("Warehouses/Warehouses/Create",);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string','unique:warehouses,name'],
            'phone'=>['nullable', 'string','unique:warehouses,phone'],
            'address' => ['nullable', 'string'],
            'is_active'=>['required','boolean'],
        ]);

        $warehouse= Warehouse::create($data);

        $locale = session('app_locale', 'en');

        // Set the success message based on the session-stored locale
        $message = $locale === 'ar'
            ? "تم إنشاء المخزن \"{$warehouse->name}\" بنجاح"
            : "warehouse \"{$warehouse->name}\" was created successfully";

        return to_route('warehouse.index')
            ->with('success', $message);

    }

    /**
     * Display the specified resource.
     */
    public function show(Warehouse $warehouse)
    {


        $query = Stock::query()
            ->where('warehouse_id', $warehouse->id)
            ->select('id', 'user_id', 'product_id', 'quantity')
            ->with([

                'product:id,name,image_url,category_id,subcategory_id,notes,description',
                'product.category:id,name',
                'product.subCategory:id,name',

                "customer.user:id,name"
            ]);

        if (request("product_name")) {
            $query->whereHas('product', function($q) {
                $q->where("name", "like", "%" . request("product_name") . "%");
            });
        }

        if (request("customer_name")) {
            $query->whereHas('customer.user', function($q) {
                $q->where("name", "like", "%" . request("customer_name") . "%");
            });
        }



        $sortField = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        $products = $query->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return inertia("Warehouses/Warehouses/Show", [
            "warehouse" => new WarehouseResource($warehouse),
            "products" => WarehouseReportResource::collection($products),
            'queryParams' => request()->query() ?: null,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Warehouse $warehouse)
    {
        return inertia('Warehouses/Warehouses/Edit', [
            'warehouse' => new WarehouseResource($warehouse),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Warehouse $warehouse)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('warehouses')->ignore($warehouse->id, 'id')],
            'phone'=>['nullable', 'string',Rule::unique('warehouses')->ignore($warehouse->id, 'id')],
            'address' => ['nullable', 'string'],
            'is_active'=>['required','boolean'],

        ]);

        $warehouse->update($data);


        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم تحديث المخزن \"{$warehouse->name}\" بنجاح"
            : "Warehouse \"{$warehouse->name}\" was updated successfully";

        return to_route('warehouse.index')
            ->with('success', $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Warehouse $warehouse)
    {
        $name = $warehouse->name;
        if ($warehouse->products()->count() > 0) {
        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "لا يمكن حذف المخزن \"{$name}\" بسبب وجود منتجات بداخله "
            : "Cannot delete warehouse \"{$name}\" because it has products inside it ";

        return to_route('warehouse.index')
            ->with('danger', $message);
        }
        $warehouse->delete();

        $locale = session('app_locale', 'en');

        $message = $locale === 'ar'
            ? "تم حذف المخزن \"{$name}\" بنجاح"
            : "warehouse \"{$name}\" was deleted successfully";

        return to_route('warehouse.index')
            ->with('success', $message);

    }
}
