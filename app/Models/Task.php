<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{


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

        'status',
        'status_remark',

        'design_status',
        'dev_status',
        'test_status',
        'approval_status',
        'deployment_status',
        'verification_Status'

    ];


    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function champion()
    {
        return $this->belongsTo(User::class, 'champion_id');
    }

    public function designer()
    {
        return $this->belongsTo(User::class, 'designer_id');
    }

    public function implementor()
    {
        return $this->belongsTo(User::class, 'implementor_id');
    }

    public function tester()
    {
        return $this->belongsTo(User::class, 'tester_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function deployer()
    {
        return $this->belongsTo(User::class, 'deployer_id');
    }

}
