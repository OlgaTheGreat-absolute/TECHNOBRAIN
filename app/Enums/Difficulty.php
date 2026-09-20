<?php

namespace App\Enums;

enum Difficulty: string
{
    case Beginner = 'beginner';
    case Intermediate = 'intermediate';
    case Advanced = 'advanced';

    public function label(): string
    {
        return match ($this) {
            self::Beginner => 'Pemula',
            self::Intermediate => 'Menengah',
            self::Advanced => 'Lanjutan',
        };
    }
}
