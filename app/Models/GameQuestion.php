<?php

namespace App\Models;

use Database\Factories\GameQuestionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['game_room_id', 'question', 'options', 'correct_index', 'seconds', 'order'])]
class GameQuestion extends Model
{
    /** @use HasFactory<GameQuestionFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'options' => 'array',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(GameRoom::class, 'game_room_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(GameAnswer::class);
    }
}
