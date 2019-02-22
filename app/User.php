<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    protected $appends = ['photo'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function getPhotoAttribute(){
        $hash = md5(trim($this->email));

        return "https://www.gravatar.com/avatar/{$hash}";
    }

    public function projects(){
        return $this->hasMany(Project::class);
    }

    public function createProject(array $projectAttributes){
        return $this->projects()->create($projectAttributes);
    }

    public function ownsProject(Project $project){
        return $this->id === (int) $project->user_id;
    }
}
