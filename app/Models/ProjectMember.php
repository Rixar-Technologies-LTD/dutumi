<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectMember extends Model
{
    //

    protected $fillable = [
        'project_id',
        'user_id',
        'added_by_user_id',
        'access_end_date'
    ];

}
