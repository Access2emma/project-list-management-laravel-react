<?php

namespace App\Http\Controllers;


use App\Project;
use App\Task;

class TaskController extends Controller
{
    public function index(Project $project){
        $projectTasks = $project->load('tasks');

        return response()->json(['data' => $projectTasks]);
    }
    public function store(){

        $validated = request()->validate([
            'title' => 'required',
            'project_id' => 'required|exists:projects,id',
            'description' => 'required'
        ], ['project_id.exists' => "The project selected is invalid"]);

        $project = Project::find($validated['project_id']);

        if($project){
            $task = $project->addTask($validated);

            return response()->json(['data' => $task->fresh()], 201);
        }else{
            return response()->json('Project not found', 404);
        }

    }

    public function markAsComplete(Task $task){
        $task->completed = true;
        $task->save();

        return response()->json('Project has been marked as completed');
    }
}
