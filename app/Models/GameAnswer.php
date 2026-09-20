<?php

namespace App\Models;

use Database\Factories\GameAnswerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['game_participant_id', 'game_question_id', 'selected_index', 'is_correct', 'points_awarded', 'time_taken_ms'])]
class GameAnswer extends Model
{
    /** @use HasFactory<GameAnswerFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_correct' => 'boolean',
        ];
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(GameParticipant::class, 'game_participant_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(GameQuestion::class, 'game_question_id');
    }
}
