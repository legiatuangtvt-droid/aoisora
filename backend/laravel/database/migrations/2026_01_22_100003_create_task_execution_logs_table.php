<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Create task_execution_logs table per CLAUDE.md Section 12.5:
     * - Log all actions taken on store assignments
     * - Track status transitions
     * - Audit trail for task execution
     */
    public function up(): void
    {
        Schema::create('task_execution_logs', function (Blueprint $table) {
            $table->id();

            // Reference to store assignment
            $table->unsignedBigInteger('task_store_assignment_id')
                ->comment('FK to task_store_assignments');

            // Action taken
            $table->enum('action', [
                'dispatched',           // HQ dispatched task to store
                'assigned_to_staff',    // Store Leader assigned to S1 staff
                'reassigned',           // Changed assigned staff
                'unassigned',           // Removed staff assignment (back to Leader)
                'started',              // Store started working on task
                'completed',            // Store marked task as done
                'marked_unable',        // Store marked as unable to complete
                'hq_checked',           // HQ checked done_pending → done
                'hq_rejected',          // HQ rejected done_pending → on_progress
            ])->comment('Type of action performed');

            // Who performed the action
            $table->integer('performed_by')
                ->comment('Staff ID who performed this action');

            // When it was performed
            $table->timestamp('performed_at')
                ->useCurrent()
                ->comment('Timestamp when action was performed');

            // Status transition tracking
            $table->string('old_status', 20)->nullable()
                ->comment('Previous status before this action');
            $table->string('new_status', 20)->nullable()
                ->comment('New status after this action');

            // Additional data depending on action type
            $table->integer('target_staff_id')->nullable()
                ->comment('For assign/reassign: the staff being assigned to');
            $table->text('notes')->nullable()
                ->comment('Additional notes, reason for unable, rejection reason, etc.');

            // Indexes
            $table->index('task_store_assignment_id', 'idx_log_assignment');
            $table->index('performed_at', 'idx_log_performed_at');
            $table->index('action', 'idx_log_action');
            $table->index('performed_by', 'idx_log_performed_by');

            // Foreign keys
            $table->foreign('task_store_assignment_id', 'fk_log_assignment')
                ->references('id')->on('task_store_assignments')
                ->onDelete('cascade');
            $table->foreign('performed_by', 'fk_log_performed_by')
                ->references('staff_id')->on('staff')
                ->onDelete('cascade');
            $table->foreign('target_staff_id', 'fk_log_target_staff')
                ->references('staff_id')->on('staff')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_execution_logs');
    }
};
