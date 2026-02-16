<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MicroPackage extends Model
{
    use HasFactory;

    protected $table = 'micro_packages';
    protected $primaryKey = 'id_micro_package';

    protected $fillable = [
        'id_user',
        'id_category',
        'title',
        'description',
        'price',
        'delivery_days',
        'status',
        'img',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'id_category', 'id_category');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'id_micro_package', 'id_micro_package');
    }
}
