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
        Schema::create('task_approval_history', function (Blueprint $table) {
            $table->id();
            $table->integer('task_id');
            $table->unsignedTinyInteger('round_number')->default(1);

            // Step info
            $table->unsignedTinyInteger('step_number'); // 1, 2, 3, 4
            $table->enum('step_name', ['SUBMIT', 'APPROVE', 'DO_TASK', 'CHECK']);
            $table->enum('step_status', ['submitted', 'done', 'in_process', 'rejected', 'pending'])->default('pending');

            // Assignment
            $table->enum('assigned_to_type', ['user', 'stores', 'team']);
            $table->unsignedBigInteger('assigned_to_id')->nullable(); // user_id or null if stores
            $table->string('assigned_to_name', 255)->nullable();
            $table->unsignedInteger('assigned_to_count')->nullable(); // for stores count

            // Dates
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamp('actual_start_at')->nullable();
            $table->timestamp('actual_end_at')->nullable();

            // Progress (for DO_TASK step)
            $table->unsignedInteger('progress_done')->default(0);
            $table->unsignedInteger('progress_total')->default(0);

            // Comment
            $table->text('comment')->nullable();

            $table->timestamps();

            // Indexes
            $table->foreign('task_id')->references('task_id')->on('tasks')->onDelete('cascade');
            $table->index(['task_id', 'round_number']);
            $table->index(['task_id', 'step_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_approval_history');
    }
};
