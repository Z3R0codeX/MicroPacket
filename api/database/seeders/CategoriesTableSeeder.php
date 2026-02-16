<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'Diseño Gráfico', 'created_at' => now()],
            ['name' => 'Programación', 'created_at' => now()],
            ['name' => 'Redacción', 'created_at' => now()],
        ]);
    }
}
