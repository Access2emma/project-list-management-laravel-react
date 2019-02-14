<?php

namespace App\Http\Controllers;

use App\Events\NewProjectCreated;
use App\Project;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function index(){
        $projects = auth()->user()->projects()
            ->withCount(['tasks' => function($task){$task->incomplete();}])
            ->latest()->get();

        return response()->json([
            'data' => $projects
        ]);
    }

    public function public(){
        $projects = Project::public()->latest()->get();

        return response()->json(['data' => $projects]);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|unique:projects',
            'description' => 'required',
            'public' => 'nullable'
        ], ['name.unique' => 'Project with same name already exists']);

        $project = $request->user()->createProject($validated);

        if($project->public){
            event(new NewProjectCreated($project));
        }

        return response()->json('Project created.', 201);
    }

    public function show(Project $project){
        try{
            $this->authorize('view', $project);
        }catch(AuthorizationException $e){
            return response()->json(['error' => 'You are not permitted to view this project'], 404);
        }

        return response()->json($project);
    }

    public function update(Request $request, Project $project){
        try{
            $this->authorize('update', $project);
        }catch(AuthorizationException $e){
            return response()->json(['error' => 'You are not permitted to update this project'], 404);
        }
        $validated = $request->validate([
            'name' => ['required', Rule::unique('projects')->ignore($project->id)],
            'description' => 'required'
        ], ['name.unique' => 'Project with same name already exists']);

        $project->fill($validated);

        $project->save();

        return response()->json($project->fresh());
    }

    public function destroy(Project $project){
        try{
            $this->authorize('delete', $project);
        }catch(AuthorizationException $e){
            return response()->json(['error' => 'You are not permitted to delete this project'], 404);
        }

        $project->delete();

        return response()->json('Project has been deleted');
    }
}
