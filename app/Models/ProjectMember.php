<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectMember extends Model
{

    public static $STATUS_ACTIVE = 'ACTIVE';
    public static $STATUS_SUSPENDED = 'SUSPENDED';
    public static $STATUS_NOT_ACTIVE = 'NOT_ACTIVE';

    protected $casts = [
        'created_at' => 'datetime:d-M-Y H:i'
    ];

    protected $with = ['user','author'];

    protected $fillable = [
        'project_id',
        'workspace_id',
        'user_id',
        'author_id',
        'status',
        'remark',
        'access_end_date'
    ];

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function author(){
        return $this->belongsTo(User::class, 'author_id');
    }

}
