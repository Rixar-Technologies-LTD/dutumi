<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    //
    protected $fillable = [

    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

}
