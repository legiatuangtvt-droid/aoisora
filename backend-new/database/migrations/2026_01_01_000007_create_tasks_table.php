<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id('task_id');
            $table->string('task_name', 500);
            $table->text('task_description')->nullable();
            $table->unsignedBigInteger('manual_id')->nullable();
            $table->unsignedBigInteger('task_type_id')->nullable();
            $table->unsignedBigInteger('response_type_id')->nullable();
            $table->integer('response_num')->nullable();
            $table->boolean('is_repeat')->default(false);
            $table->jsonb('repeat_config')->nullable();
            $table->unsignedBigInteger('dept_id')->nullable();
            $table->unsignedBigInteger('assigned_store_id')->nullable();
            $table->unsignedBigInteger('assigned_staff_id')->nullable();
            $table->unsignedBigInteger('do_staff_id')->nullable();
            $table->unsignedBigInteger('status_id')->nullable();
            $table->string('priority', 20)->default('normal');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->time('start_time')->nullable();
            $table->timestamp('due_datetime')->nullable();
            $table->timestamp('completed_time')->nullable();
            $table->text('comment')->nullable();
            $table->jsonb('attachments')->nullable();
            $table->unsignedBigInteger('created_staff_id')->nullable();
            $table->timestamps();

            $table->foreign('manual_id')->references('manual_id')->on('manuals')->onDelete('set null');
            $table->foreign('task_type_id')->references('code_master_id')->on('code_master');
            $table->foreign('response_type_id')->references('code_master_id')->on('code_master');
            $table->foreign('dept_id')->references('department_id')->on('departments')->onDelete('set null');
            $table->foreign('assigned_store_id')->references('store_id')->on('stores')->onDelete('set null');
            $table->foreign('assigned_staff_id')->references('staff_id')->on('staff')->onDelete('set null');
            $table->foreign('do_staff_id')->references('staff_id')->on('staff')->onDelete('set null');
            $table->foreign('status_id')->references('code_master_id')->on('code_master');
            $table->foreign('created_staff_id')->references('staff_id')->on('staff');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
