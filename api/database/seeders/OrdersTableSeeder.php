<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrdersTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('orders')->insert([
            'id_user' => 1, // Comprador
            'id_micro_package' => 1,
            'price' => 150.00,
            'status' => 'completed',
            'start_day' => Carbon::now()->subDays(5),
            'end_day' => Carbon::now()->subDays(3),
            'created_at' => now(),
        ]);
    }
}
