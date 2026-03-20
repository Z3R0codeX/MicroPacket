<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'id_user';

    /**
     * Atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'bio',
        'img',
        'seller_rating',
        'profile_icon',   // Icono personalizado (Ionicons)
        'profile_color'   // Color de marca del usuario
    ];

    /**
     * Atributos que deben ocultarse en las respuestas JSON.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Conversión de tipos de atributos.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'seller_rating' => 'decimal:2', // Asegura que el rating siempre sea numérico
        ];
    }
}