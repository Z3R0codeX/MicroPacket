<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'username' => 'juan_cliente',
                'email' => 'juan@example.com',
                'password' => Hash::make('password123'),
                'seller_rating' => 0,
                'bio' => 'Busco desarrolladores para mis proyectos.',
                'created_at' => now(),
            ],
            [
                'username' => 'dev_master',
                'email' => 'dev@example.com',
                'password' => Hash::make('password123'),
                'seller_rating' => 4.8,
                'bio' => 'Programador Fullstack con 5 años de experiencia.',
                'created_at' => now(),
            ],
        ]);
    }
}
