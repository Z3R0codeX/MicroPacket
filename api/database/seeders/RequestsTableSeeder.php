<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RequestsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('requests')->insert([
            'id_user' => 1,
            'title' => 'Necesito un Logo para App',
            'description' => 'Busco algo minimalista para una app de micro-paquetes.',
            'budget' => 500.00,
            'expiration_date' => Carbon::now()->addDays(10),
            'status' => 'open',
            'created_at' => now(),
        ]);
    }
}
