<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{

    public static $STATUS_ACTIVE = 'ACTIVE';
    public static $STATUS_NOT_ACTIVE = 'NOT_ACTIVE';

    protected $fillable = [
        'owner_user_id',
        'project_name',
        'project_description',
        'project_type',
        'start_date',
        'mvp_date',
        'status'
    ];

}
