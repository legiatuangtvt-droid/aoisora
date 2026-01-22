<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Redesign task_library table to match CLAUDE.md Section 12.0 & 12.3:
     * - Library stores task templates (from Task List auto-save or direct creation)
     * - Templates can be dispatched multiple times to different stores
     * - Has status: draft, approve, available, cooldown
     * - Has cooldown mechanism to prevent duplicate dispatch
     */
    public function up(): void
    {
        // Drop old task_library table if exists (will recreate with new structure)
        Schema::dropIfExists('task_library');

        Schema::create('task_library', function (Blueprint $table) {
            $table->id('task_library_id');

            // Source tracking (which flow created this template)
            $table->enum('source', ['task_list', 'library'])
                ->default('task_list')
                ->comment('task_list=auto-saved when task approved, library=created directly in Library');

            // Status for Library templates
            $table->enum('status', ['draft', 'approve', 'available', 'cooldown'])
                ->default('available')
                ->comment('draft/approve only for direct Library creation (Flow 2)');

            // =====================================================
            // A. Information Section (copied from task)
            // =====================================================
            $table->string('task_name', 255);
            $table->text('task_description')->nullable();
            $table->integer('task_type_id')->nullable()
                ->comment('FK to code_master (Task Type: Yearly, Quarterly, Monthly, Weekly, Daily)');
            $table->integer('response_type_id')->nullable()
                ->comment('FK to code_master (Response Type)');
            $table->integer('response_num')->nullable()
                ->comment('Number of responses required');
            $table->boolean('is_repeat')->default(false);
            $table->json('repeat_config')->nullable()
                ->comment('Repeat configuration if is_repeat=true');
            $table->integer('dept_id')->nullable()
                ->comment('FK to departments');

            // =====================================================
            // B. Instructions Section
            // =====================================================
            $table->enum('task_instruction_type', ['image', 'document'])
                ->default('image')
                ->comment('Type determines required fields: image=photo_guidelines, document=note');
            $table->string('manual_link', 500)->nullable()
                ->comment('Direct URL link to manual/instruction document');
            $table->json('photo_guidelines')->nullable()
                ->comment('Array of photo URLs for task instructions (when type=image)');
            $table->integer('manual_id')->nullable()
                ->comment('FK to manual_documents');
            $table->text('comment')->nullable()
                ->comment('Note/instructions for document type');
            $table->json('attachments')->nullable()
                ->comment('Array of attachment file paths');

            // =====================================================
            // Creator & Approval (for Flow 2: direct Library creation)
            // =====================================================
            $table->integer('created_staff_id')->nullable()
                ->comment('Staff who created this template');
            $table->integer('approver_id')->nullable()
                ->comment('Staff who approves this template (Flow 2 only)');
            $table->timestamp('submitted_at')->nullable()
                ->comment('When template was submitted for approval (Flow 2)');
            $table->timestamp('approved_at')->nullable()
                ->comment('When template was approved');

            // =====================================================
            // Rejection tracking (for Flow 2)
            // =====================================================
            $table->integer('rejection_count')->default(0)
                ->comment('Number of times rejected (max 3)');
            $table->boolean('has_changes_since_rejection')->default(false)
                ->comment('Must edit before resubmit after rejection');
            $table->text('last_rejection_reason')->nullable();
            $table->timestamp('last_rejected_at')->nullable();
            $table->integer('last_rejected_by')->nullable();

            // =====================================================
            // Dispatch tracking
            // =====================================================
            $table->integer('dispatch_count')->default(0)
                ->comment('Number of times this template has been dispatched');
            $table->timestamp('last_dispatched_at')->nullable();
            $table->integer('last_dispatched_by')->nullable();

            // =====================================================
            // Cooldown mechanism (prevent duplicate dispatch)
            // =====================================================
            $table->timestamp('cooldown_until')->nullable()
                ->comment('Cooldown expires at this time');
            $table->integer('cooldown_triggered_by')->nullable()
                ->comment('User who triggered cooldown (dispatched first)');
            $table->timestamp('cooldown_triggered_at')->nullable();

            // =====================================================
            // Issue tracking (for Pause workflow)
            // =====================================================
            $table->boolean('had_issues')->default(false)
                ->comment('True if any dispatched task was paused due to issues');
            $table->text('issues_note')->nullable()
                ->comment('Note about past issues');

            // =====================================================
            // Link to original task (if auto-saved from Task List)
            // =====================================================
            $table->integer('original_task_id')->nullable()
                ->comment('Original task_id if auto-saved from Task List approval');

            // Audit timestamps
            $table->timestamps();

            // =====================================================
            // Indexes
            // =====================================================
            $table->index('source', 'idx_library_source');
            $table->index('status', 'idx_library_status');
            $table->index('created_staff_id', 'idx_library_creator');
            $table->index('dept_id', 'idx_library_dept');
            $table->index(['status', 'source'], 'idx_library_status_source');

            // =====================================================
            // Foreign Keys
            // =====================================================
            $table->foreign('task_type_id', 'fk_library_task_type')
                ->references('code_master_id')->on('code_master')
                ->onDelete('set null');
            $table->foreign('response_type_id', 'fk_library_response_type')
                ->references('code_master_id')->on('code_master')
                ->onDelete('set null');
            $table->foreign('dept_id', 'fk_library_dept')
                ->references('department_id')->on('departments')
                ->onDelete('set null');
            $table->foreign('manual_id', 'fk_library_manual')
                ->references('document_id')->on('manual_documents')
                ->onDelete('set null');
            $table->foreign('created_staff_id', 'fk_library_creator')
                ->references('staff_id')->on('staff')
                ->onDelete('set null');
            $table->foreign('approver_id', 'fk_library_approver')
                ->references('staff_id')->on('staff')
                ->onDelete('set null');
            $table->foreign('last_rejected_by', 'fk_library_rejected_by')
                ->references('staff_id')->on('staff')
                ->onDelete('set null');
            $table->foreign('last_dispatched_by', 'fk_library_dispatched_by')
                ->references('staff_id')->on('staff')
                ->onDelete('set null');
            $table->foreign('cooldown_triggered_by', 'fk_library_cooldown_by')
                ->references('staff_id')->on('staff')
                ->onDelete('set null');
            $table->foreign('original_task_id', 'fk_library_original_task')
                ->references('task_id')->on('tasks')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_library');
    }
};
