<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('reviews')->insert([
            'id_order' => 1,
            'id_user' => 1,
            'rating' => 5,
            'comment' => 'Excelente servicio, muy rápido.',
            'created_at' => now(),
        ]);
    }
}
