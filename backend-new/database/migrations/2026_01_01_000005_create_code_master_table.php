<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('code_master', function (Blueprint $table) {
            $table->id('code_master_id');
            $table->string('code_type', 50);
            $table->string('code', 50);
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['code_type', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('code_master');
    }
};
