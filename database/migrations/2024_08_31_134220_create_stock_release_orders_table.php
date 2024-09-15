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
        Schema::create('stock_release_orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('customer_id')->references('user_id')->on('customers')->onDelete('cascade');
            $table->boolean('created_by_user');

            $table->text('description')->nullable();
            $table->text('delivery_address')->nullable();

            $table->enum('status', ['pending', 'approved', 'rejected','delivered'])->default('pending');
            $table->enum('confirmed', ['pending', 'approved', 'rejected'])->default('pending');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_release_orders');
    }
};
