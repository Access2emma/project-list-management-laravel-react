<?php

namespace App\Http\Controllers;

use App\Project;

class ProjectController extends Controller
{
    public function index(){
        $projects = Project::LatestWithTaskCount();

        return response()->json([
            'data' => $projects
        ]);
    }

    public function store(){
        $validated = request()->validate([
            'name' => 'required|unique:projects',
            'description' => 'required'
        ], ['name.unique' => 'Project with same name already exists']);

        Project::create($validated);

        return response()->json('Project created.', 201);
    }

    public function show(Project $project){
        if(! $project){
            return response()->json(['error' => 'Project not found'], 404);
        }else{
            return response()->json($project);
        }
    }

    public function destroy(Project $project){
        $project->delete();

        return response()->json('Project has been deleted');
    }
}
