<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id('store_id');
            $table->string('store_name', 255);
            $table->string('store_code', 50)->unique()->nullable();
            $table->unsignedBigInteger('region_id')->nullable();
            $table->text('address')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->unsignedBigInteger('manager_id')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();

            $table->foreign('region_id')->references('region_id')->on('regions')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
