<?php

namespace Database\Seeders;

use App\Models\Customer;
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
            'email' => 'SysmtemAdmin@SysmtemAdmin.SysmtemAdmin',
            'password' =>Hash::make('SysmtemAdmin'),
        ]);

        $user->assignRole('SystemAdmin');

    }
}
