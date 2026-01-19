<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Models\Notification;
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
                            {--dry-run : Show what would be deleted without actually deleting}
                            {--send-warnings : Also send warning notifications for drafts expiring soon}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete draft tasks that have not been modified for 1 month and send expiration warnings';

    /**
     * Status ID for DRAFT in code_master table
     */
    const DRAFT_STATUS_ID = 12;

    /**
     * Number of days before a draft is considered stale
     */
    const STALE_DAYS = 30;

    /**
     * Warning period - start sending warnings X days before deletion
     */
    const WARNING_DAYS = 5;

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        $sendWarnings = $this->option('send-warnings');
        $cutoffDate = now()->subDays(self::STALE_DAYS);

        // 1. Send warnings for drafts expiring soon (25-30 days old)
        if ($sendWarnings) {
            $this->sendExpirationWarnings($isDryRun);
        }

        // 2. Delete stale drafts (30+ days old)
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

        // Delete stale drafts and send deletion notifications
        $deletedCount = 0;
        foreach ($staleDrafts as $draft) {
            try {
                // Create notification before deleting
                $this->createDeletionNotification($draft);

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

    /**
     * Send warning notifications for drafts expiring in 1-5 days
     */
    private function sendExpirationWarnings(bool $isDryRun = false): void
    {
        // Find drafts that will expire in 1-5 days
        $warningStartDate = now()->subDays(self::STALE_DAYS - self::WARNING_DAYS); // 25 days old
        $warningEndDate = now()->subDays(self::STALE_DAYS - 1); // 29 days old

        $expiringDrafts = Task::where('status_id', self::DRAFT_STATUS_ID)
            ->whereBetween('updated_at', [$warningEndDate, $warningStartDate])
            ->get();

        if ($expiringDrafts->isEmpty()) {
            $this->info('No expiring drafts found for warnings.');
            return;
        }

        $this->info("Found {$expiringDrafts->count()} draft(s) expiring soon:");

        // Display table of expiring drafts
        $tableData = $expiringDrafts->map(function ($task) {
            $daysUntilDeletion = self::STALE_DAYS - now()->diffInDays($task->updated_at);
            return [
                'ID' => $task->task_id,
                'Name' => substr($task->task_name, 0, 40),
                'Created By' => $task->created_staff_id,
                'Days Until Deletion' => $daysUntilDeletion,
            ];
        })->toArray();

        $this->table(['ID', 'Name', 'Created By', 'Days Until Deletion'], $tableData);

        if ($isDryRun) {
            $this->warn('DRY RUN: No warning notifications were sent.');
            return;
        }

        // Send warning notifications
        $warningsSent = 0;
        foreach ($expiringDrafts as $draft) {
            try {
                $daysUntilDeletion = self::STALE_DAYS - now()->diffInDays($draft->updated_at);
                $this->createWarningNotification($draft, $daysUntilDeletion);
                $warningsSent++;
            } catch (\Exception $e) {
                $this->error("Failed to send warning for task {$draft->task_id}: {$e->getMessage()}");
                Log::error("Failed to send draft expiration warning", [
                    'task_id' => $draft->task_id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("Sent {$warningsSent} warning notification(s).");
    }

    /**
     * Create a warning notification for an expiring draft
     */
    private function createWarningNotification(Task $draft, int $daysUntilDeletion): void
    {
        // Check if we already sent a notification today for this draft
        $existingNotification = Notification::where('recipient_staff_id', $draft->created_staff_id)
            ->where('type', 'draft_expiration_warning')
            ->where('data->task_id', $draft->task_id)
            ->whereDate('created_at', now()->toDateString())
            ->exists();

        if ($existingNotification) {
            return; // Don't send duplicate notifications on the same day
        }

        Notification::create([
            'recipient_staff_id' => $draft->created_staff_id,
            'type' => 'draft_expiration_warning',
            'title' => 'Draft Expiring Soon',
            'message' => "Task \"{$draft->task_name}\" will be deleted in {$daysUntilDeletion} " .
                         ($daysUntilDeletion === 1 ? 'day' : 'days') .
                         " due to inactivity. Edit or submit it to prevent deletion.",
            'action_url' => "/tasks/new?id={$draft->task_id}&source={$draft->source}",
            'data' => [
                'task_id' => $draft->task_id,
                'task_name' => $draft->task_name,
                'days_until_deletion' => $daysUntilDeletion,
            ],
            'is_read' => false,
        ]);
    }

    /**
     * Create a notification when a draft is auto-deleted
     */
    private function createDeletionNotification(Task $draft): void
    {
        Notification::create([
            'recipient_staff_id' => $draft->created_staff_id,
            'type' => 'draft_auto_deleted',
            'title' => 'Draft Automatically Deleted',
            'message' => "Task \"{$draft->task_name}\" was automatically deleted due to no edits in the last 30 days.",
            'data' => [
                'task_name' => $draft->task_name,
                'deleted_at' => now()->toIso8601String(),
            ],
            'is_read' => false,
        ]);
    }
}
