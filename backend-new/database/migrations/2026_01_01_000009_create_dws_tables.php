<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Task Groups
        Schema::create('task_groups', function (Blueprint $table) {
            $table->id('task_group_id');
            $table->string('group_name', 255);
            $table->string('group_code', 50)->unique()->nullable();
            $table->text('description')->nullable();
            $table->string('color', 20)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Shift Codes
        Schema::create('shift_codes', function (Blueprint $table) {
            $table->id('shift_code_id');
            $table->string('shift_code', 20)->unique();
            $table->string('shift_name', 100);
            $table->time('start_time');
            $table->time('end_time');
            $table->decimal('break_hours', 4, 2)->default(0);
            $table->string('color', 20)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Shift Assignments
        Schema::create('shift_assignments', function (Blueprint $table) {
            $table->id('shift_assignment_id');
            $table->unsignedBigInteger('staff_id');
            $table->unsignedBigInteger('store_id');
            $table->date('work_date');
            $table->unsignedBigInteger('shift_code_id');
            $table->time('actual_start_time')->nullable();
            $table->time('actual_end_time')->nullable();
            $table->string('status', 20)->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('staff_id')->references('staff_id')->on('staff')->onDelete('cascade');
            $table->foreign('store_id')->references('store_id')->on('stores')->onDelete('cascade');
            $table->foreign('shift_code_id')->references('shift_code_id')->on('shift_codes');
            $table->unique(['staff_id', 'work_date']);
        });

        // Shift Templates
        Schema::create('shift_templates', function (Blueprint $table) {
            $table->id('shift_template_id');
            $table->string('template_name', 255);
            $table->unsignedBigInteger('store_id')->nullable();
            $table->jsonb('template_data');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('store_id')->references('store_id')->on('stores')->onDelete('cascade');
        });

        // Task Library
        Schema::create('task_library', function (Blueprint $table) {
            $table->id('task_library_id');
            $table->string('task_name', 500);
            $table->text('task_description')->nullable();
            $table->unsignedBigInteger('task_group_id')->nullable();
            $table->integer('estimated_minutes')->nullable();
            $table->string('priority', 20)->default('normal');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('task_group_id')->references('task_group_id')->on('task_groups')->onDelete('set null');
        });

        // Daily Templates
        Schema::create('daily_templates', function (Blueprint $table) {
            $table->id('daily_template_id');
            $table->string('template_name', 255);
            $table->unsignedBigInteger('store_id')->nullable();
            $table->integer('day_of_week')->nullable();
            $table->jsonb('template_data');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('store_id')->references('store_id')->on('stores')->onDelete('cascade');
        });

        // Daily Schedule Tasks
        Schema::create('daily_schedule_tasks', function (Blueprint $table) {
            $table->id('schedule_task_id');
            $table->unsignedBigInteger('store_id');
            $table->date('work_date');
            $table->unsignedBigInteger('task_library_id')->nullable();
            $table->string('task_name', 500);
            $table->unsignedBigInteger('task_group_id')->nullable();
            $table->unsignedBigInteger('assigned_staff_id')->nullable();
            $table->time('scheduled_start_time')->nullable();
            $table->time('scheduled_end_time')->nullable();
            $table->time('actual_start_time')->nullable();
            $table->time('actual_end_time')->nullable();
            $table->string('status', 20)->default('pending');
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('store_id')->references('store_id')->on('stores')->onDelete('cascade');
            $table->foreign('task_library_id')->references('task_library_id')->on('task_library')->onDelete('set null');
            $table->foreign('task_group_id')->references('task_group_id')->on('task_groups')->onDelete('set null');
            $table->foreign('assigned_staff_id')->references('staff_id')->on('staff')->onDelete('set null');
            $table->foreign('created_by')->references('staff_id')->on('staff')->onDelete('set null');

            $table->index(['store_id', 'work_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_schedule_tasks');
        Schema::dropIfExists('daily_templates');
        Schema::dropIfExists('task_library');
        Schema::dropIfExists('shift_templates');
        Schema::dropIfExists('shift_assignments');
        Schema::dropIfExists('shift_codes');
        Schema::dropIfExists('task_groups');
    }
};
