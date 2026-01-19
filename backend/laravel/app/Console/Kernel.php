<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Clean up stale drafts (not modified for 1 month) and send expiration warnings
        // Runs daily at 2:00 AM
        $schedule->command('tasks:cleanup-stale-drafts --send-warnings')
            ->daily()
            ->at('02:00')
            ->onOneServer()
            ->withoutOverlapping()
            ->appendOutputTo(storage_path('logs/cleanup-stale-drafts.log'));
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
