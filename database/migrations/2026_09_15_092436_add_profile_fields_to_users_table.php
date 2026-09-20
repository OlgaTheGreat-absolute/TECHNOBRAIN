<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('student')->after('email');
            $table->foreignId('education_level_id')->nullable()->after('role')->constrained()->nullOnDelete();
            $table->string('institution')->nullable()->after('education_level_id');
            $table->foreignId('department_id')->nullable()->after('institution')->constrained()->nullOnDelete();
            $table->string('grade_or_semester')->nullable()->after('department_id');
            $table->boolean('is_active')->default(true)->after('grade_or_semester');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('education_level_id');
            $table->dropConstrainedForeignId('department_id');
            $table->dropColumn(['role', 'institution', 'grade_or_semester', 'is_active']);
        });
    }
};
