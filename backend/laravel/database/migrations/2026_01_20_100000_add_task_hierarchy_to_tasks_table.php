<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Add task hierarchy support (parent_task_id and task_level)
     * to enable nested sub-tasks (max 5 levels)
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Add parent_task_id column after task_id
            $table->unsignedInteger('parent_task_id')->nullable()->after('task_id');

            // Add task_level column (1=parent, 2-5=sub-tasks)
            $table->tinyInteger('task_level')->default(1)->after('parent_task_id');

            // Add foreign key constraint
            $table->foreign('parent_task_id', 'fk_tasks_parent')
                ->references('task_id')
                ->on('tasks')
                ->onDelete('cascade');

            // Add indexes for performance
            $table->index('parent_task_id', 'idx_tasks_parent');
            $table->index('task_level', 'idx_tasks_level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Drop foreign key and indexes first
            $table->dropForeign('fk_tasks_parent');
            $table->dropIndex('idx_tasks_parent');
            $table->dropIndex('idx_tasks_level');

            // Drop columns
            $table->dropColumn(['parent_task_id', 'task_level']);
        });
    }
};
