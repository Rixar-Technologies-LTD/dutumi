<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

/**
 * @property $name
 * @property $email
 * @property $password
 * @property $default_workspace_id
 * @property $last_login_at
 * @property $logins_count
 */
class User extends Authenticatable
{

    const STATUS_ACTIVE = 'ACTIVE';
    const STATUS_DISABLED = 'DISABLED';

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens,HasFactory, Notifiable;

    protected $casts = [
        'created_at' => 'datetime:d-M-Y H:i',
        'updated_at' => 'datetime:d-m-Y H:i'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'default_workspace_id',

        'last_login_at',
        'logins_count',

        'creator_id',
        'creator_name'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function members()
    {
        return $this->hasMany(ProjectMember::class, 'user_id', 'id');
    }

    public function workspace()
    {
        return $this->belongsTo(WorkSpace::class, 'default_workspace_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'default_workspace_id');
    }


}
