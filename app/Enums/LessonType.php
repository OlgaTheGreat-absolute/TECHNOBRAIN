<?php

namespace App\Enums;

enum LessonType: string
{
    case Video = 'video';
    case Pdf = 'pdf';
    case Quiz = 'quiz';

    public function label(): string
    {
        return match ($this) {
            self::Video => 'Video',
            self::Pdf => 'PDF',
            self::Quiz => 'Quiz',
        };
    }
}
