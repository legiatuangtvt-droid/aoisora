<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Task 1.1.6: Add missing foreign keys and fix existing FK references
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // 1. Add FK for library_task_id → task_library
            // Note: library_task_id is int, task_library.task_library_id is bigint
            // Need to change library_task_id to bigint to match
        });

        // Modify library_task_id to bigint unsigned to match task_library PK
        DB::statement('ALTER TABLE tasks MODIFY library_task_id BIGINT UNSIGNED NULL');

        Schema::table('tasks', function (Blueprint $table) {
            // Add FK for library_task_id
            $table->foreign('library_task_id', 'fk_tasks_library')
                ->references('task_library_id')->on('task_library')
                ->onDelete('set null');

            // Add index for library_task_id (for queries to find tasks from a library template)
            $table->index('library_task_id', 'idx_tasks_library');

            // Add composite index for draft queries (per CLAUDE.md Section 12.1)
            // Drafts are queried by: created_staff_id + source + status
            // Already have idx_tasks_source_status_created, but add one for library drafts
            $table->index(['created_staff_id', 'source', 'status_id', 'submitted_at'], 'idx_tasks_draft_status');

            // Add index for receiver_type (for filtering store vs hq_user tasks)
            $table->index('receiver_type', 'idx_tasks_receiver_type');

            // Add composite index for dispatched tasks (common query pattern)
            $table->index(['dispatched_at', 'status_id'], 'idx_tasks_dispatched');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop FKs
            $table->dropForeign('fk_tasks_library');

            // Drop indexes
            $table->dropIndex('idx_tasks_library');
            $table->dropIndex('idx_tasks_draft_status');
            $table->dropIndex('idx_tasks_receiver_type');
            $table->dropIndex('idx_tasks_dispatched');
        });

        // Revert library_task_id back to int
        DB::statement('ALTER TABLE tasks MODIFY library_task_id INT NULL');
    }
};
