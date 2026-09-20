<?php

namespace App\Models;

use App\Enums\GameStatus;
use Database\Factories\GameRoomFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['code', 'title', 'host_id', 'status', 'current_question_index', 'default_seconds', 'current_question_started_at'])]
class GameRoom extends Model
{
    /** @use HasFactory<GameRoomFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => GameStatus::class,
            'current_question_started_at' => 'datetime',
        ];
    }

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(GameQuestion::class)->orderBy('order');
    }

    public function participants(): HasMany
    {
        return $this->hasMany(GameParticipant::class);
    }

    public function currentQuestion(): ?GameQuestion
    {
        if ($this->current_question_index < 0) {
            return null;
        }

        return $this->questions->get($this->current_question_index);
    }

    public function questionSeconds(?GameQuestion $question = null): int
    {
        $question ??= $this->currentQuestion();

        return $question?->seconds ?? $this->default_seconds;
    }

    public function secondsRemaining(): int
    {
        if (! $this->current_question_started_at) {
            return 0;
        }

        $elapsed = now()->diffInSeconds($this->current_question_started_at);

        return max(0, $this->questionSeconds() - $elapsed);
    }

    public static function generateCode(): string
    {
        // Excludes visually-ambiguous characters (0/O, 1/I/L) since students
        // type this code by hand to join.
        $alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

        do {
            $code = collect(range(1, 6))->map(fn () => $alphabet[random_int(0, strlen($alphabet) - 1)])->implode('');
        } while (self::where('code', $code)->exists());

        return $code;
    }
}
