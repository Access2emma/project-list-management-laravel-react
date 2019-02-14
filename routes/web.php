<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'PagesController@index');
Route::get('/projects', 'PagesController@project');
Route::get('/projects/{path?}', 'PagesController@project');
Route::get('/projects/{path?}/{name?}', 'PagesController@project');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('api/projects/public', 'ProjectController@public');

Route::prefix('/api')->middleware('auth')->group(function(){
    Route::get('/projects', 'ProjectController@index');

    Route::post('/projects', 'ProjectController@store');
    Route::get('/projects/{project}', 'ProjectController@show');
    Route::patch('/projects/{project}', 'ProjectController@update');
    Route::delete('/projects/{project}', 'ProjectController@destroy');

    Route::get('/projects/{project}/tasks', 'TaskController@index');
    Route::post('/tasks', 'TaskController@store');
    Route::patch('/tasks/{task}', 'TaskController@markAsComplete');
});
