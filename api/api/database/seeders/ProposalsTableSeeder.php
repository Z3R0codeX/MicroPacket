<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProposalsTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('proposals')->insert([
            'id_request' => 1,
            'id_user' => 2,
            'proposed_price' => 450.00,
            'offer' => 'Puedo hacer tu logo en 3 días, incluye 2 revisiones.',
            'delivery_days' => 3,
            'status' => 'pending',
            'created_at' => now(),
        ]);
    }
}
