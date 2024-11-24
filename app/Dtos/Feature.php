<?php

namespace App\Dtos;

use App\Models\Task;
use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{

    protected $table = 'tasks';

    protected $with = ['parent'];

    protected $casts = [
        'created_at' => 'datetime:d-M-Y H:i',
        'updated_at' => 'datetime:d-M-Y H:i',
        'start_date' => 'datetime:d-m-Y',
        'end_date' => 'datetime:d-m-Y',
    ];

    protected $fillable = [

        'project_id',
        'parent_id',

        'creator_id',

        'champion_id',
        'designer_id',
        'implementor_id',
        'tester_id',
        'approver_id',
        'deployer_id',

        'name',
        'type',
        'priority',
        'description',

        'start_date',
        'end_date',

        'status'
    ];


    public function parent()
    {
        return $this->belongsTo(Task::class, 'parent_id');
    }

}
