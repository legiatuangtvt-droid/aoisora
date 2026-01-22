<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Create task_store_assignments table to track:
     * - Task assignment to stores (HQ dispatches task to stores)
     * - Store execution status (not_yet, on_progress, done, unable)
     * - Staff assignment within store (Store Leader assigns to S1)
     * - Execution timestamps and completion tracking
     */
    public function up(): void
    {
        Schema::create('task_store_assignments', function (Blueprint $table) {
            $table->id();
            $table->integer('task_id');
            $table->integer('store_id');

            // Status tracking
            $table->enum('status', ['not_yet', 'on_progress', 'done_pending', 'done', 'unable'])
                ->default('not_yet')
                ->comment('Store execution status: not_yet=initial, on_progress=working, done_pending=submitted waiting HQ check, done=HQ confirmed, unable=cannot complete');

            // Timestamps
            $table->timestamp('assigned_at')->useCurrent()
                ->comment('When HQ dispatched task to this store');
            $table->timestamp('started_at')->nullable()
                ->comment('When store started working on task');
            $table->timestamp('completed_at')->nullable()
                ->comment('When store marked done/unable');

            // User tracking (HQ → Store)
            $table->integer('assigned_by')->nullable()
                ->comment('HQ staff who dispatched task to store');

            // User tracking (Within Store - Store Leader assigns to Staff)
            $table->integer('assigned_to_staff')->nullable()
                ->comment('Staff (S1) assigned by Store Leader. NULL = Store Leader handles it');
            $table->timestamp('assigned_to_at')->nullable()
                ->comment('When Store Leader assigned to staff');

            // Execution tracking
            $table->integer('started_by')->nullable()
                ->comment('Store user who started (Store Leader or assigned Staff)');
            $table->integer('completed_by')->nullable()
                ->comment('Store user who completed/marked unable');

            // HQ Check tracking (for done_pending → done flow)
            $table->integer('checked_by')->nullable()
                ->comment('HQ staff who verified the completion');
            $table->timestamp('checked_at')->nullable()
                ->comment('When HQ verified the completion');
            $table->text('check_notes')->nullable()
                ->comment('Notes from HQ checker');

            // Unable specific
            $table->text('unable_reason')->nullable()
                ->comment('Required reason when status=unable');

            // Additional info
            $table->text('notes')->nullable()
                ->comment('General notes for this assignment');

            // Audit timestamps
            $table->timestamps();

            // Constraints
            $table->unique(['task_id', 'store_id'], 'unique_task_store');

            // Indexes for performance
            $table->index(['task_id', 'status'], 'idx_task_status');
            $table->index(['store_id', 'status'], 'idx_store_status');
            $table->index('assigned_to_staff', 'idx_assigned_staff');
            $table->index('status', 'idx_status');

            // Foreign keys
            $table->foreign('task_id', 'fk_tsa_task')
                ->references('task_id')->on('tasks')
                ->onDelete('cascade');
            $table->foreign('store_id', 'fk_tsa_store')
                ->references('store_id')->on('stores')
                ->onDelete('cascade');
            $table->foreign('assigned_by', 'fk_tsa_assigned_by')
                ->references('staff_id')->on('staff')
                ->onDelete('set null');
            $table->foreign('assigned_to_staff', 'fk_tsa_assigned_to_staff')
                ->references('staff_id')->on('staff')
                ->onDelete('set null');
            $table->foreign('started_by', 'fk_tsa_started_by')
                ->references('staff_id')->on('staff')
                ->onDelete('set null');
            $table->foreign('completed_by', 'fk_tsa_completed_by')
                ->references('staff_id')->on('staff')
                ->onDelete('set null');
            $table->foreign('checked_by', 'fk_tsa_checked_by')
                ->references('staff_id')->on('staff')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_store_assignments');
    }
};
