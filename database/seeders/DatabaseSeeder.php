<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Product\ProductCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


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

        ProductCategory::insert([
            ['name' => 'Electronics', 'is_active' => true],
            ['name' => 'Furniture', 'is_active' => true],
            ['name' => 'Clothing', 'is_active' => false],
        ]);
    }
}
