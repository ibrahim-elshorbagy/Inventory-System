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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receive_order_id')->constrained('receive_orders')->onDelete('cascade');

            $table->string('name');
            $table->decimal('quantity', 20, 2);
            $table->text('description')->nullable();
            $table->text('notes')->nullable();
            $table->string('image_url')->nullable();

            $table->foreignId('category_id')->constrained('product_categories')->onDelete('cascade');
            $table->foreignId('subcategory_id')->constrained('sub_categories')->onDelete('cascade');

            $table->foreignId('user_id')->constrained('customers', 'user_id')->onDelete('cascade');
            $table->foreignId('warehouse_id')->constrained('warehouses')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
