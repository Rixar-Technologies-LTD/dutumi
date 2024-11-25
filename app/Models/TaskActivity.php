<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskActivity extends Model
{

    protected $casts = [
        'created_at' => 'datetime:d-M-Y H:i'
    ];

    protected $with = ['author'];

    protected $fillable = [
        'author_id',
        'task_id',
        'message',
        'type',
        'attachment_type',
        'attachment_url'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
