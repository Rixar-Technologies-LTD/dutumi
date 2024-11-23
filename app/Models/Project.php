<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{

    public static $STATUS_ACTIVE = 'ACTIVE';

    public static $STATUS_NOT_ACTIVE = 'NOT_ACTIVE';

    protected $casts = [
        'created_at' => 'datetime:d-M-Y H:i'
    ];

    protected $fillable = [
        'owner_user_id',
        'name',
        'description',
        'type',
        'start_date',
        'mvp_date',
        'status'
    ];

    public function members()
    {
        return $this->hasMany(ProjectMember::class,  'project_id');
    }

}
