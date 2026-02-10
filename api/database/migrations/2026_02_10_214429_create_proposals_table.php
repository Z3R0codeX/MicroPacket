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
        Schema::create('proposals', function (Blueprint $table) {
     $table->id('id_proposal');
        $table->foreignId('id_request')->constrained('requests', 'id_request');
        $table->foreignId('id_user')->constrained('users', 'id_user'); // El Freelancer
        $table->decimal('proposed_price', 10, 2);
        $table->text('offer');
        $table->integer('delivery_days');
        $table->string('status', 20)->default('pending');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
