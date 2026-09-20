<?php

namespace App\Enums;

enum Powerup: string
{
    case FiftyFifty = 'fifty_fifty';
    case ExtraTime = 'extra_time';
    case DoublePoints = 'double_points';

    public function label(): string
    {
        return match ($this) {
            self::FiftyFifty => '50:50',
            self::ExtraTime => '+5 Detik',
            self::DoublePoints => 'Poin Ganda',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::FiftyFifty => 'Menghilangkan 2 jawaban yang salah.',
            self::ExtraTime => 'Menambah 5 detik waktu mengerjakan.',
            self::DoublePoints => 'Poin soal ini menjadi dua kali lipat.',
        };
    }
}
