<?php

namespace App\Models;

use App\Enums\ProgressStatus;
use Database\Factories\ProgressFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'material_id', 'status', 'percent', 'last_activity_at', 'completed_at'])]
class Progress extends Model
{
    /** @use HasFactory<ProgressFactory> */
    use HasFactory;

    protected $table = 'progress';

    protected function casts(): array
    {
        return [
            'status' => ProgressStatus::class,
            'last_activity_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function material(): BelongsTo
    {
        return $this->belongsTo(Material::class);
    }
}
