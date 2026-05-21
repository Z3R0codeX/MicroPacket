<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MicroPackagesTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('micro_packages')->insert([
            'id_user' => 2,
            'id_category' => 2,
            'title' => 'Instalación de Scripts Laravel',
            'description' => 'Instalo y configuro tu proyecto Laravel en producción.',
            'price' => 150.00,
            'delivery_days' => 2,
            'status' => 'active',
            'created_at' => now(),
        ]);
    }
}
