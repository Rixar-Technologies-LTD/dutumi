<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AssetGroup extends Model
{

    protected $casts = [
        'created_at' => 'datetime:d-M-Y H:i',
        'updated_at' => 'datetime:d-M-Y H:i'
    ];

    protected $fillable = [
        'project_id',
        'author_id',
        'name'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function assets()
    {
        return $this->hasMany(Asset::class, 'asset_group_id');
    }

}
