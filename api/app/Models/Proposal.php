<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    use HasFactory;

    protected $table = 'proposals';
    protected $primaryKey = 'id_proposal';

    protected $fillable = [
        'id_request',
        'id_user',
        'proposed_price',
        'offer',
        'delivery_days',
        'status',
    ];

    public function request()
    {
        return $this->belongsTo(Request::class, 'id_request', 'id_request');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'id_proposal', 'id_proposal');
    }
}
