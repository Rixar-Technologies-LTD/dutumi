<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkSpace extends Model
{

    const STATUS_ACTIVE = "ACTIVE";
    const STATUS_DISABLED = "DISABLED";

    protected $fillable = [
        'user_id',
        'name',
        'status'
    ];

}
