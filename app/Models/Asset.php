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
        'location',
        'type',
        'category',

        'unit_price',
        'price_currency',
        'unit_price_in_default_currency',

        'remarks',
        'ownership',
        'usage_status',
        'subscription_months',
        'next_payment_date',
        'vendor',
        'url',

        'host_name',
        'ip_address',
        'mac_address',

        'storage',
        'storage_type',
        'memory',
        'memory_type',
        'operating_system',

    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

}
