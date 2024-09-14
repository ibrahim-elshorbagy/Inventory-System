<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Product\ProductCategory;
use App\Models\Product\SubCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {



        $this->call(RolesAndPermissionsSeeder::class);

        //admin
        $user = User::factory()->create([
            'id'=>1,
            'name' => 'System Admin',
            'email' => 'a@a.a',
            'password' =>Hash::make('a'),
        ]);

        $user->assignRole('SystemAdmin');

        $user = User::factory()->create([
            'name' => 'ibrahim mohamed',
            'email' => 'c@c.c',
            'password' =>Hash::make('c'),
        ]);
        $customer = $user->customer()->create([
            'phone' => '123456789',
            'address' => '123 Main St, City, Country',
        ]);
        $user->assignRole('customer');

        ProductCategory::insert([
            ['name' => 'Electronics', 'is_active' => true],
            ['name' => 'Furniture', 'is_active' => true],
            ['name' => 'Clothing', 'is_active' => false],
        ]);
        SubCategory::insert([
            ['name' => 'Laptop', 'category_id' => 1, 'is_active' => true],
            ['name' => 'Desktop', 'category_id' => 1, 'is_active' => true],
            ['name' => 'Chair', 'category_id' => 2, 'is_active' => true],
            ['name' => 'Table', 'category_id' => 2, 'is_active' => true]]);

                 DB::table('warehouses')->insert([
            [
                'name' => 'Warehouse One',
                'address' => '123 Main St, City A',
                'phone' => '1234567890',
                'is_active' => true,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Warehouse Two',
                'address' => '456 Market St, City B',
                'phone' => '0987654321',
                'is_active' => true,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Warehouse Three',
                'address' => '789 High St, City C',
                'phone' => '5551234567',
                'is_active' => false,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Warehouse Four',
                'address' => '321 River St, City D',
                'phone' => '5559876543',
                'is_active' => true,
                'created_by' => 1,
                'updated_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
