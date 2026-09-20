<?php

namespace App\Enums;

enum ContentType: string
{
    case ThreeD = '3d';
    case Image = 'image';

    public function label(): string
    {
        return match ($this) {
            self::ThreeD => '3D Interaktif',
            self::Image => 'Gambar',
        };
    }

    public function icon(): string
    {
        return match ($this) {
            self::ThreeD => 'cube',
            self::Image => 'photo',
        };
    }
}
