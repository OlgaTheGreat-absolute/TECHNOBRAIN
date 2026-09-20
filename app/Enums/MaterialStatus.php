<?php

namespace App\Enums;

enum MaterialStatus: string
{
    case Draft = 'draft';
    case Published = 'published';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Published => 'Diterbitkan',
        };
    }
}
