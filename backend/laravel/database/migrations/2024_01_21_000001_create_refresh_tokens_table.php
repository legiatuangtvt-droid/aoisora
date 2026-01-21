<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('refresh_tokens', function (Blueprint $table) {
            $table->id();
            $table->integer('staff_id'); // Match staff.staff_id type (INT NOT NULL)
            $table->string('token_hash', 64); // SHA-256 hash
            $table->uuid('family_id'); // Group related tokens for security
            $table->timestamp('expires_at');
            $table->timestamp('revoked_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Indexes for performance
            $table->index('token_hash', 'idx_token_hash');
            $table->index('staff_id', 'idx_staff_id');
            $table->index('family_id', 'idx_family_id');
            $table->index('expires_at', 'idx_expires_at');

            // Foreign key - references staff table with staff_id as primary key
            $table->foreign('staff_id')
                ->references('staff_id')
                ->on('staff')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refresh_tokens');
    }
};
