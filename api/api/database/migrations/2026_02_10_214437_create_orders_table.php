<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
          $table->id('id_order');
        $table->foreignId('id_user')->constrained('users', 'id_user'); // El Comprador
        $table->foreignId('id_micro_package')->nullable()->constrained('micro_packages', 'id_micro_package');
        $table->foreignId('id_proposal')->nullable()->constrained('proposals', 'id_proposal');
        $table->decimal('price', 10, 2);
        $table->string('status', 20)->default('in_progress');
        $table->date('start_day');
        $table->date('end_day')->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
