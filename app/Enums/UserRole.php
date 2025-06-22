<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case EMPLOYEE = 'employee';

    /**
     * Get all role values as an array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}