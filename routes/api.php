<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/projects', 'ProjectController@index');
Route::post('/projects', 'ProjectController@store');
Route::get('/projects/{project}', 'ProjectController@show');
Route::patch('/projects/{project}', 'ProjectController@markAsComplete');
Route::delete('/projects/{project}', 'ProjectController@destroy');

Route::get('/projects/{project}/tasks', 'TaskController@index');
Route::post('/tasks', 'TaskController@store');
Route::patch('/tasks/{task}', 'TaskController@markAsComplete');

