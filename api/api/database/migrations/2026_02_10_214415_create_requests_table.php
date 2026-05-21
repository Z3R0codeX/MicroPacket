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
        Schema::create('requests', function (Blueprint $table) {
    $table->id('id_request');
        $table->foreignId('id_user')->constrained('users', 'id_user');
        $table->string('title', 100);
        $table->text('description');
        $table->decimal('budget', 10, 2);
        $table->date('expiration_date');
        $table->string('status', 20)->default('open');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
