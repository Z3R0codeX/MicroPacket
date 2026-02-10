<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class MicroPacketSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Usuarios
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

        // 2. Categorías
        DB::table('categories')->insert([
            ['name' => 'Diseño Gráfico', 'created_at' => now()],
            ['name' => 'Programación', 'created_at' => now()],
            ['name' => 'Redacción', 'created_at' => now()],
        ]);

        // 3. Solicitudes (Requests) - El usuario 1 pide algo
        DB::table('requests')->insert([
            'id_user' => 1,
            'title' => 'Necesito un Logo para App',
            'description' => 'Busco algo minimalista para una app de micro-paquetes.',
            'budget' => 500.00,
            'expiration_date' => Carbon::now()->addDays(10),
            'status' => 'open',
            'created_at' => now(),
        ]);

        // 4. Micro Paquetes (Servicios) - El usuario 2 ofrece algo
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

        // 5. Propuestas - El usuario 2 le responde a la solicitud del usuario 1
        DB::table('proposals')->insert([
            'id_request' => 1,
            'id_user' => 2,
            'proposed_price' => 450.00,
            'offer' => 'Puedo hacer tu logo en 3 días, incluye 2 revisiones.',
            'delivery_days' => 3,
            'status' => 'pending',
            'created_at' => now(),
        ]);

        // 6. Órdenes (Simulamos una compra directa del Micro Paquete)
        DB::table('orders')->insert([
            'id_user' => 1, // Comprador
            'id_micro_package' => 1,
            'price' => 150.00,
            'status' => 'completed',
            'start_day' => Carbon::now()->subDays(5),
            'end_day' => Carbon::now()->subDays(3),
            'created_at' => now(),
        ]);

        // 7. Reseñas (El comprador califica al vendedor por la orden terminada)
        DB::table('reviews')->insert([
            'id_order' => 1,
            'user_id' => 1,
            'rating' => 5,
            'comment' => 'Excelente servicio, muy rápido.',
            'created_at' => now(),
        ]);
    }
}