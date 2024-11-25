<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{

    protected $casts = [
        'created_at' => 'datetime:d-M-Y H:i',
        'updated_at' => 'datetime:d-M-Y H:i',
        'next_payment_date' => 'datetime:d-m-Y'
    ];

    protected $fillable = [
        'project_id',
        'asset_group_id',
        'author_id',

        'name',
        'description',
        'type',
        'category',

        'unit_price',

        'remarks',
        'usage_status',
        'subscription_months',
        'next_payment_date'
    ];


    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

}
