<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{

    //
    public static $TYPE_FEATURE = "FEATURE";
    public static $TYPE_RELEASE = "RELEASE";
    public static $TYPE_TASK = "TASK";

    protected $fillable = [

    ];

}
