<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'username' => 'Test User', // <--- CAMBIAR 'name' POR 'username'
            'email' => 'test@example.com',
        ]);

        $this->call([
            UsersTableSeeder::class,
            CategoriesTableSeeder::class,
            RequestsTableSeeder::class,
            MicroPackagesTableSeeder::class,
            ProposalsTableSeeder::class,
            OrdersTableSeeder::class,
            ReviewsTableSeeder::class,
        ]);
    }
}
