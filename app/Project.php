<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['name', 'description', 'public'];

    protected $casts = ['public' => 'boolean'];

    protected static function boot()
    {
        parent::boot();

        Project::deleted(function($project){
            $project->tasks->each->delete();
        });
    }


    public function addTask(array $taskData){
        return $this->tasks()->create($taskData);
    }
    
    public function tasks(){
        return $this->hasMany(Task::class);
    }

    public function owner(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopePublic($query){
        return $query->wherePublic(true);
    }
}
