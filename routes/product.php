<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\User\UserCRUDController;
use App\Http\Controllers\Product\BrandController;
use App\Http\Controllers\Product\ModelController;
use App\Http\Controllers\Product\ProductCategoryController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\UnitController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;


//--------------------------------------------------------------------------------------------- categories
Route::group(['middleware' => ['permission:create-category']], function () {
    Route::get('/product/category/create', [ProductCategoryController::class, 'create'])->name('category.create');
    Route::post('/product/category', [ProductCategoryController::class, 'store'])->name('category.store');
});

Route::group(['middleware' => ['permission:read-category']], function () {
    Route::get('/product/category', [ProductCategoryController::class, 'index'])->name('category.index');
});

Route::group(['middleware' => ['permission:update-category']], function () {
    Route::get('/product/category/{category}/edit', [ProductCategoryController::class, 'edit'])->name('category.edit');
    Route::put('/product/category/{category}', [ProductCategoryController::class, 'update'])->name('category.update');
});

Route::group(['middleware' => ['permission:delete-category']], function () {
    Route::delete('/product/category/{category}', [ProductCategoryController::class, 'destroy'])->name('category.destroy');
});


//--------------------------------------------------------------------------------------------- models
Route::group(['middleware' => ['permission:create-model']], function () {
    Route::get('/product/model/create', [ModelController::class, 'create'])->name('model.create');
    Route::post('/product/model', [ModelController::class, 'store'])->name('model.store');
});

Route::group(['middleware' => ['permission:read-model']], function () {
    Route::get('/product/model', [ModelController::class, 'index'])->name('model.index');
    // Route::get('/product/model/{model}', [ModelController::class, 'show'])->name('model.show');
});

Route::group(['middleware' => ['permission:update-model']], function () {
    Route::get('/product/model/{model}/edit', [ModelController::class, 'edit'])->name('model.edit');
    Route::put('/product/model/{model}', [ModelController::class, 'update'])->name('model.update');
});

Route::group(['middleware' => ['permission:delete-model']], function () {
    Route::delete('/product/model/{model}', [ModelController::class, 'destroy'])->name('model.destroy');
});
//--------------------------------------------------------------------------------------------- brands
Route::group(['middleware' => ['permission:create-brand']], function () {
    Route::get('/product/brand/create', [BrandController::class, 'create'])->name('brand.create');
    Route::post('/product/brand', [BrandController::class, 'store'])->name('brand.store');
});

Route::group(['middleware' => ['permission:read-brand']], function () {
    Route::get('/product/brand', [BrandController::class, 'index'])->name('brand.index');
    // Route::get('/product/brand/{brand}', [BrandController::class, 'show'])->name('brand.show');
});

Route::group(['middleware' => ['permission:update-brand']], function () {
    Route::get('/product/brand/{brand}/edit', [BrandController::class, 'edit'])->name('brand.edit');
    Route::put('/product/brand/{brand}', [BrandController::class, 'update'])->name('brand.update');
});

Route::group(['middleware' => ['permission:delete-brand']], function () {
    Route::delete('/product/brand/{brand}', [BrandController::class, 'destroy'])->name('brand.destroy');
});

//--------------------------------------------------------------------------------------------- units
Route::group(['middleware' => ['permission:create-unit']], function () {
    Route::get('/product/unit/create', [UnitController::class, 'create'])->name('unit.create');
    Route::post('/product/unit', [UnitController::class, 'store'])->name('unit.store');
});

Route::group(['middleware' => ['permission:read-unit']], function () {
    Route::get('/product/unit', [UnitController::class, 'index'])->name('unit.index');
    // Route::get('/product/unit/{unit}', [UnitController::class, 'show'])->name('unit.show');
});

Route::group(['middleware' => ['permission:update-unit']], function () {
    Route::get('/product/unit/{unit}/edit', [UnitController::class, 'edit'])->name('unit.edit');
    Route::put('/product/unit/{unit}', [UnitController::class, 'update'])->name('unit.update');
});

Route::group(['middleware' => ['permission:delete-unit']], function () {
    Route::delete('/product/unit/{unit}', [UnitController::class, 'destroy'])->name('unit.destroy');
});
//--------------------------------------------------------------------------------------------- products
Route::group(['middleware' => ['permission:create-product']], function () {
    Route::get('/product/create', [ProductController::class, 'create'])->name('product.create');
    Route::post('/product', [ProductController::class, 'store'])->name('product.store');
});

Route::group(['middleware' => ['permission:read-product']], function () {
    Route::get('/product', [ProductController::class, 'index'])->name('product.index');
    // Route::get('/product/{product}', [ProductController::class, 'show'])->name('product.show');
});

Route::group(['middleware' => ['permission:update-product']], function () {
    Route::get('/product/{product}/edit', [ProductController::class, 'edit'])->name('product.edit');
    Route::put('/product/{product}', [ProductController::class, 'update'])->name('product.update');

    Route::post('/product/bulk-update', [ProductController::class, 'bulkUpdate'])->name('product.bulkUpdate'); // New Route

});

Route::group(['middleware' => ['permission:delete-product']], function () {
    Route::delete('/product/{product}', [ProductController::class, 'destroy'])->name('product.destroy');
});
