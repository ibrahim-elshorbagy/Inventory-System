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
        Schema::create('stock_release_requests', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('stock_release_order_id');
            $table->foreign('stock_release_order_id')->references('id')->on('stock_release_orders')->onDelete('cascade');

            $table->foreignId('stock_id')->references('id')->on('stocks')->onDelete('cascade');
            $table->decimal('quantity', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_release_requests');
    }
};
