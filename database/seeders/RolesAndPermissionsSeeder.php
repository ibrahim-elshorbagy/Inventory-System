<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\Customer;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Clear cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Base entities for CRUD operations
        $basePermissions = [
            'main-category',
            'sub-category',
            'product',
            'customer',
            'warehouse',
            'stock',
        ];

        // Insert CRUD permissions for each entity
        foreach ($basePermissions as $basePermission) {
            Permission::firstOrCreate(['name' => 'create-' . $basePermission]);
            Permission::firstOrCreate(['name' => 'read-' . $basePermission]);
            Permission::firstOrCreate(['name' => 'update-' . $basePermission]);
            Permission::firstOrCreate(['name' => 'delete-' . $basePermission]);
        }

        // Additional permissions for specific roles
        $additionalPermissions = [

            //system admin

            'view-admin-dashboard',
            'for-SystemAdmin-manage-users',
            'for-SystemAdmin-manage-roles-permissions',

            //customer
            'for-Acustomer-view-dashboard',
            'for-Acustomer-my-products-report',
            'for-Acustomer-make-release-repuest',

            //admin
            'admin-orders-index',
            'admin-orders-change-status',
            'admin-orders-make',
            "admin-orders-update",
            "admin-orders-delete",
        ];

        // Create additional permissions
        foreach ($additionalPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Define roles
        $SystemAdminRole = Role::firstOrCreate(['name' => 'SystemAdmin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $customerRole = Role::firstOrCreate(['name' => 'customer']);







        $permissionsForSystemAdmin = Permission::whereNotIn('name', [
            'for-Acustomer-view-dashboard',
            'for-Acustomer-my-products-report',
            'for-Acustomer-make-release-repuest',
        ])->get();

        // Assign the filtered permissions to the SystemAdmin role
        $SystemAdminRole->syncPermissions($permissionsForSystemAdmin);

        // Assign SystemAdmin role to a specific user (you can adjust the user id)
        $systemAdminUser = User::find(1);  // assuming user with ID 1 is SystemAdmin
        if ($systemAdminUser) {
            $systemAdminUser->assignRole('SystemAdmin');
        }






        // Manually assign specific permissions to the 'admin' role
        $adminPermissions = [
            'view-admin-dashboard',

            'create-main-category',
            'read-main-category',
            'update-main-category',

            'create-sub-category',
            'read-sub-category',
            'update-sub-category',

            'create-product',
            'read-product',
            'update-product',

            'create-customer',
            'read-customer',
            'update-customer',

            'create-warehouse',
            'read-warehouse',
            'update-warehouse',

            'create-stock',
            'read-stock',
            'update-stock',
            'delete-stock',

            'admin-orders-index',
            'admin-orders-change-status',
            'admin-orders-make',
            "admin-orders-update",

        ];
        $adminRole->syncPermissions($adminPermissions);






        $customerPermissions = [
            "for-Acustomer-view-dashboard",
            'for-Acustomer-my-products-report',
            'for-Acustomer-make-release-repuest',

        ];
        $customerRole->syncPermissions($customerPermissions);



    }





}
