<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add fields for:
     * - Task Instructions (B. Instructions section from spec)
     * - Workflow tracking (dispatch, pause)
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // =====================================================
            // B. Instructions Section Fields (per spec 12.1)
            // =====================================================

            // Task instruction type: 'image' requires photo guidelines, 'document' requires note
            $table->enum('task_instruction_type', ['image', 'document'])
                ->default('image')
                ->after('task_description')
                ->comment('Type determines required fields: image=photo_guidelines, document=note');

            // Manual link URL (separate from manual_id which is FK to manuals table)
            $table->string('manual_link', 500)
                ->nullable()
                ->after('task_instruction_type')
                ->comment('Direct URL link to manual/instruction document');

            // Photo guidelines for image type tasks (array of photo URLs/paths)
            $table->json('photo_guidelines')
                ->nullable()
                ->after('manual_link')
                ->comment('Array of photo URLs for task instructions (when type=image)');

            // =====================================================
            // Workflow Tracking Fields
            // =====================================================

            // When task was dispatched to stores (after approval)
            $table->timestamp('dispatched_at')
                ->nullable()
                ->after('approved_at')
                ->comment('Timestamp when task was sent to stores after approval');

            // Pause workflow (per spec 12 - PAUSE flow)
            $table->timestamp('paused_at')
                ->nullable()
                ->after('dispatched_at')
                ->comment('Timestamp when task was paused by approver');

            $table->unsignedInteger('paused_by')
                ->nullable()
                ->after('paused_at')
                ->comment('Staff ID who paused the task (must be approver)');

            // =====================================================
            // Indexes
            // =====================================================
            $table->index('task_instruction_type', 'idx_tasks_instruction_type');

            // Foreign key for paused_by
            $table->foreign('paused_by', 'fk_tasks_paused_by')
                ->references('staff_id')
                ->on('staff')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign('fk_tasks_paused_by');

            // Drop index
            $table->dropIndex('idx_tasks_instruction_type');

            // Drop columns
            $table->dropColumn([
                'task_instruction_type',
                'manual_link',
                'photo_guidelines',
                'dispatched_at',
                'paused_at',
                'paused_by',
            ]);
        });
    }
};
