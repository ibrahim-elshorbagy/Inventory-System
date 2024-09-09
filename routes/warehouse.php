<?php

use App\Http\Controllers\Warehouse\StockController;
use App\Http\Controllers\Warehouse\WarehouseController;
use Illuminate\Support\Facades\Route;



//--------------------------------------------------------------------------------------------- warehouses

Route::group(['middleware' => ['permission:create-warehouse']], function () {
    Route::get('/warehouse/create', [WarehouseController::class, 'create'])->name('warehouse.create');
    Route::post('/warehouse', [WarehouseController::class, 'store'])->name('warehouse.store');
});

Route::group(['middleware' => ['permission:read-warehouse']], function () {
    Route::get('/warehouse', [WarehouseController::class, 'index'])->name('warehouse.index');
    Route::get('/warehouse/{warehouse}', [WarehouseController::class, 'show'])->name('warehouse.show');
});

Route::group(['middleware' => ['permission:update-warehouse']], function () {
    Route::get('/warehouse/{warehouse}/edit', [WarehouseController::class, 'edit'])->name('warehouse.edit');
    Route::put('/warehouse/{warehouse}', [WarehouseController::class, 'update'])->name('warehouse.update');
});

Route::group(['middleware' => ['permission:delete-warehouse']], function () {
    Route::delete('/warehouse/{warehouse}', [WarehouseController::class, 'destroy'])->name('warehouse.destroy');
});

//--------------------------------------------------------------------------------------------- stock

Route::group(['middleware' => ['permission:create-stock']], function () {
    Route::get('/stock/create/{customer}', [StockController::class, 'create'])->name('stock.create');
    Route::post('/stock', [StockController::class, 'store'])->name('stock.store');
});

Route::group(['middleware' => ['permission:read-stock']], function () {
    Route::get('/stock', [StockController::class, 'index'])->name('stock.index');
    Route::get('/stock/{customer}', [StockController::class, 'show'])->name('customer.stock.show');
    Route::get('/stock/print/{customer}', [StockController::class, 'printAll'])->name('customer.stock.print');

});

Route::group(['middleware' => ['permission:update-stock']], function () {
    Route::get('/stock/{customer}/edit', [StockController::class, 'edit'])->name('stock.edit');
    Route::put('/stock/{customer}/update', [StockController::class, 'update'])->name('stock.update');
});

Route::group(['middleware' => ['permission:delete-stock']], function () {
    Route::delete('/stock/{stock}', [StockController::class, 'destroy'])->name('stock.destroy');
});
