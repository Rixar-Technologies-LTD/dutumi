<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{

    protected $fillable = [
        'project_id',
        'creator_user_id',
        'assignee_user_id',

        'name',
        'type',
        'start_date',
        'end_date'
    ];

}
