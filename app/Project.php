<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['name', 'description'];

    protected static function boot()
    {
        parent::boot();

        Project::deleted(function($project){
            $project->tasks->each->delete();
        });
    }

    public static function LatestWithTaskCount()
    {
        return static::withCount(['tasks' => function($task){$task->incomplete();}])
            ->latest()
            ->get(['id', 'name', 'description']);
    }

    public function addTask(array $taskData){
        return $this->tasks()->create($taskData);
    }
    
    public function tasks(){
        return $this->hasMany(Task::class);
    }
}
