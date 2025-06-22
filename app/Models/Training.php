<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Training extends Model
{
    protected $fillable = [
        'title',
        'description',
        'date',
        'location',
        'max_participants',
    ];

    protected $casts = [
        'date' => 'datetime',
    ];

    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function getCurrentRegistrationsCountAttribute()
    {
        return $this->registrations()->count();
    }

    public function getRegistrationStatusAttribute()
    {
        return $this->current_registrations_count . '/' . $this->max_participants;
    }
}