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
        Schema::create('micro_packages', function (Blueprint $table) {
          $table->id('id_micro_package');
        $table->foreignId('id_user')->constrained('users', 'id_user');
        $table->foreignId('id_category')->constrained('categories', 'id_category');
        $table->string('title', 100);
        $table->text('description');
        $table->decimal('price', 10, 2);
        $table->integer('delivery_days');
        $table->string('status', 20)->default('active');
        $table->string('img', 50)->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('micro_packages');
    }
};
