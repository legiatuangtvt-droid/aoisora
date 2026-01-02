<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Manual Folders
        Schema::create('manual_folders', function (Blueprint $table) {
            $table->id('folder_id');
            $table->string('folder_name', 255);
            $table->unsignedBigInteger('parent_folder_id')->nullable();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('created_by')->references('staff_id')->on('staff')->onDelete('set null');
        });

        // Self-referencing FK for parent folder
        Schema::table('manual_folders', function (Blueprint $table) {
            $table->foreign('parent_folder_id')->references('folder_id')->on('manual_folders')->onDelete('cascade');
        });

        // Manual Documents
        Schema::create('manual_documents', function (Blueprint $table) {
            $table->id('document_id');
            $table->unsignedBigInteger('folder_id');
            $table->string('document_title', 255);
            $table->text('summary')->nullable();
            $table->string('status', 20)->default('draft');
            $table->integer('version')->default(1);
            $table->integer('view_count')->default(0);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->foreign('folder_id')->references('folder_id')->on('manual_folders')->onDelete('cascade');
            $table->foreign('created_by')->references('staff_id')->on('staff')->onDelete('set null');
        });

        // Manual Steps
        Schema::create('manual_steps', function (Blueprint $table) {
            $table->id('step_id');
            $table->unsignedBigInteger('document_id');
            $table->integer('step_number');
            $table->string('step_title', 255);
            $table->text('step_content');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('document_id')->references('document_id')->on('manual_documents')->onDelete('cascade');
            $table->unique(['document_id', 'step_number']);
        });

        // Manual Media
        Schema::create('manual_media', function (Blueprint $table) {
            $table->id('media_id');
            $table->unsignedBigInteger('step_id');
            $table->string('media_type', 20);
            $table->string('file_name', 255);
            $table->text('file_path');
            $table->bigInteger('file_size')->nullable();
            $table->string('mime_type', 100)->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('step_id')->references('step_id')->on('manual_steps')->onDelete('cascade');
        });

        // Manual View Logs
        Schema::create('manual_view_logs', function (Blueprint $table) {
            $table->id('view_log_id');
            $table->unsignedBigInteger('document_id');
            $table->unsignedBigInteger('staff_id');
            $table->timestamp('viewed_at');
            $table->integer('time_spent_seconds')->nullable();

            $table->foreign('document_id')->references('document_id')->on('manual_documents')->onDelete('cascade');
            $table->foreign('staff_id')->references('staff_id')->on('staff')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('manual_view_logs');
        Schema::dropIfExists('manual_media');
        Schema::dropIfExists('manual_steps');
        Schema::dropIfExists('manual_documents');
        Schema::table('manual_folders', function (Blueprint $table) {
            $table->dropForeign(['parent_folder_id']);
        });
        Schema::dropIfExists('manual_folders');
    }
};
