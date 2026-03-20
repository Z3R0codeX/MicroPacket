<?php   
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';
    protected $primaryKey = 'id_category';

    protected $fillable = [
        'name',
        'icon',
    ];

    public function microPackages()
    {
        return $this->hasMany(MicroPackage::class, 'id_category', 'id_category');
    }
}
