<?php

use App\Http\Controllers\Admin\Customer\CustomerController;
use App\Http\Controllers\Customer\ReportController;
use App\Http\Controllers\Customer\StockReleaseRequestController;
use App\Http\Controllers\Product\ProductCategoryController;
use Illuminate\Support\Facades\Route;


//--------------------------------------------------------------------------------------------- customers

// Create customer routes with permission checks
Route::group(['middleware' => ['permission:create-customer']], function () {
    Route::get('/customer/create', [CustomerController::class, 'create'])->name('customer.create');
    Route::post('/customer', [CustomerController::class, 'store'])->name('customer.store');
});

Route::group(['middleware' => ['permission:read-customer']], function () {
    Route::get('/customer', [CustomerController::class, 'index'])->name('customer.index');
    // Optional show route for viewing a single customer
});

Route::group(['middleware' => ['permission:update-customer']], function () {
    Route::get('/customer/{customer}/edit', [CustomerController::class, 'edit'])->name('customer.edit');
    Route::put('/customer/{customer}', [CustomerController::class, 'update'])->name('customer.update');
});

Route::group(['middleware' => ['permission:delete-customer']], function () {
    Route::delete('/customer/{customer}', [CustomerController::class, 'destroy'])->name('customer.destroy');
});


//--------------------------------------------------------------------------------------------- My Products Report

Route::group(['middleware' => ['permission:for-Acustomer-my-products-report']], function () {
    Route::get('/customer/my-products-report', [ReportController::class, 'MyProductRport'])->name('for-Acustomer-my-products-report');

});

//--------------------------------------------------------------------------------------------- My Products Release Request

Route::group(['middleware' => ['permission:for-Acustomer-make-release-repuest']], function () {

    Route::get('/customer/make-release-request',[StockReleaseRequestController::class,'MakeReleaseRequest'])->name('customer.make-release-request');
    Route::post('/customer/store-release-request',[StockReleaseRequestController::class,'MakeReleaseRequestStore'])->name('customer.store.release.repuest');

    Route::get('/customer/my-repuests',[StockReleaseRequestController::class,'MyRequests'])->name('customer.show.my-requests');

    Route::get('/customer/edit-release-request/{id}',[StockReleaseRequestController::class,'EditReleaseRequest'])->name('customer.edit-release-request');
    Route::put('/customer/updte-release-request/{id}',[StockReleaseRequestController::class,'UpdateReleaseRequest'])->name('customer.update.release.repuest');

    Route::delete('/customer/delete-release-request/{id}', [StockReleaseRequestController::class, 'destroyReleaseRequest'])->name('customer.destroy.release.repuest');

});
