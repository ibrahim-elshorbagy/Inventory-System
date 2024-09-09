<?php

use App\Http\Controllers\Admin\Orders\OrdersController;
use App\Http\Controllers\Admin\Orders\OrdersCRUDController;
use App\Http\Controllers\Admin\Orders\OrdersDashboardController;
use App\Http\Controllers\Admin\RolesPermissionsController;
use Illuminate\Support\Facades\Route;




//--------------------------------------------------------------------------------------------- Requests Dashboard

Route::group(['middleware' => ['permission:admin-orders-index']], function () {

    Route::get('/admin/orders',[OrdersDashboardController::class,'index'])->name('admin.index.orders');
    Route::get('/admin/orders/{order}',[OrdersDashboardController::class,'show'])->name('admin.show.order');

});

Route::group(['middleware' => ['permission:admin-orders-change-status']], function () {

    Route::post('/admin/orders/change-status/{order}',[OrdersController::class,'ChangeStatus'])->name('admin.orders.changeStatus');

});

Route::group(['middleware' => ['permission:admin-orders-make']], function () {

    Route::get('/admin/make-order/{customer}',[OrdersCRUDController::class,'create'])->name('admin.make-order');
    Route::post('/admin/store-order',[OrdersCRUDController::class,'store'])->name('admin.store-order');

});

Route::group(['middleware' => ['permission:admin-orders-update']], function () {

    Route::get('/admin/edit-order/{customerId}/{orderId}',[OrdersCRUDController::class,'edit'])->name('admin.edit-order');
    Route::put('/admin/updte-order/{id}',[OrdersCRUDController::class,'update'])->name('admin.update-order');

});
Route::group(['middleware' => ['permission:admin-orders-delete']], function () {

    Route::delete('/admin/delete-order/{order}', [OrdersCRUDController::class, 'destroy'])->name('admin.delete-order');

});
//--------------------------------------------------------------------------------------------- Only SystemAdmin


Route::group(['middleware' => ['permission:for-SystemAdmin-manage-roles-permissions']], function () {
    Route::get('/admin/roles-permissions', [RolesPermissionsController::class, 'index'])->name('admin.roles-permissions.index');
    Route::get('/admin/roles-permissions/{role}/edit', [RolesPermissionsController::class, 'edit'])->name('admin.roles-permissions.edit');
    Route::put('/admin/roles-permissions/{role}', [RolesPermissionsController::class, 'update'])->name('admin.roles-permissions.update');
});
