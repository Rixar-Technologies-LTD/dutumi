<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectMember extends Model
{

    public static $STATUS_ACTIVE = 'ACTIVE';
    public static $STATUS_SUSPENDED = 'SUSPENDED';
    public static $STATUS_NOT_ACTIVE = 'NOT_ACTIVE';

    protected $with = ['user','added_by_user'];

    protected $fillable = [
        'project_id',
        'user_id',
        'added_by_user_id',
        'status',
        'remark',
        'access_end_date'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function added_by_user(){
        return $this->belongsTo(User::class, 'added_by_user_id');
    }

}
