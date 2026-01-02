<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id('staff_id');
            $table->string('staff_name', 255);
            $table->string('staff_code', 50)->unique()->nullable();
            $table->string('username', 100)->unique();
            $table->string('email', 100)->unique()->nullable();
            $table->string('phone', 20)->nullable();
            $table->unsignedBigInteger('store_id')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->string('role', 50)->default('STAFF');
            $table->string('password_hash', 255);
            $table->string('status', 20)->default('active');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('store_id')->references('store_id')->on('stores')->onDelete('set null');
            $table->foreign('department_id')->references('department_id')->on('departments')->onDelete('set null');
        });

        // Add manager FK to stores
        Schema::table('stores', function (Blueprint $table) {
            $table->foreign('manager_id')->references('staff_id')->on('staff')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropForeign(['manager_id']);
        });
        Schema::dropIfExists('staff');
    }
};
