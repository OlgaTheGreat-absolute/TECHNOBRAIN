<?php

namespace App\Models;

use App\Enums\Powerup;
use Database\Factories\GameParticipantFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['game_room_id', 'user_id', 'powerup', 'powerup_used', 'score'])]
class GameParticipant extends Model
{
    /** @use HasFactory<GameParticipantFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'powerup' => Powerup::class,
            'powerup_used' => 'boolean',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(GameRoom::class, 'game_room_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(GameAnswer::class);
    }
}
