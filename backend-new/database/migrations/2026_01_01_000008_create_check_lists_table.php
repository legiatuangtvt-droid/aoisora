<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('check_lists', function (Blueprint $table) {
            $table->id('check_list_id');
            $table->string('check_list_name', 500);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('task_check_list', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('task_id');
            $table->unsignedBigInteger('check_list_id');
            $table->boolean('check_status')->default(false);
            $table->unsignedBigInteger('checked_by')->nullable();
            $table->timestamp('checked_at')->nullable();
            $table->timestamps();

            $table->foreign('task_id')->references('task_id')->on('tasks')->onDelete('cascade');
            $table->foreign('check_list_id')->references('check_list_id')->on('check_lists')->onDelete('cascade');
            $table->foreign('checked_by')->references('staff_id')->on('staff')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_check_list');
        Schema::dropIfExists('check_lists');
    }
};
