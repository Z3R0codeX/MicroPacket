<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $table = 'requests';
    protected $primaryKey = 'id_request';

    protected $fillable = [
        'id_user',
        'title',
        'description',
        'budget',
        'expiration_date',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class, 'id_request', 'id_request');
    }
}
