<?php

namespace App\Console\Commands;

use App\Models\Task;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class CleanupStaleDrafts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:cleanup-stale-drafts
                            {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete draft tasks that have not been modified for 1 month';

    /**
     * Status ID for DRAFT in code_master table
     */
    const DRAFT_STATUS_ID = 12;

    /**
     * Number of days before a draft is considered stale
     */
    const STALE_DAYS = 30;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        $cutoffDate = now()->subDays(self::STALE_DAYS);

        $this->info("Looking for drafts not modified since: {$cutoffDate->toDateTimeString()}");

        // Find stale drafts
        $staleDrafts = Task::where('status_id', self::DRAFT_STATUS_ID)
            ->where('updated_at', '<', $cutoffDate)
            ->get();

        if ($staleDrafts->isEmpty()) {
            $this->info('No stale drafts found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$staleDrafts->count()} stale draft(s):");

        // Display table of drafts to be deleted
        $tableData = $staleDrafts->map(function ($task) {
            return [
                'ID' => $task->task_id,
                'Name' => substr($task->task_name, 0, 40),
                'Created By' => $task->created_staff_id,
                'Last Modified' => $task->updated_at->toDateTimeString(),
            ];
        })->toArray();

        $this->table(['ID', 'Name', 'Created By', 'Last Modified'], $tableData);

        if ($isDryRun) {
            $this->warn('DRY RUN: No drafts were actually deleted.');
            return Command::SUCCESS;
        }

        // Delete stale drafts
        $deletedCount = 0;
        foreach ($staleDrafts as $draft) {
            try {
                $draft->delete();
                $deletedCount++;
                Log::info("Deleted stale draft task", [
                    'task_id' => $draft->task_id,
                    'task_name' => $draft->task_name,
                    'created_staff_id' => $draft->created_staff_id,
                    'last_modified' => $draft->updated_at,
                ]);
            } catch (\Exception $e) {
                $this->error("Failed to delete task {$draft->task_id}: {$e->getMessage()}");
                Log::error("Failed to delete stale draft", [
                    'task_id' => $draft->task_id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("Successfully deleted {$deletedCount} stale draft(s).");

        return Command::SUCCESS;
    }
}
