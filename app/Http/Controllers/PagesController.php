<?php

namespace App\Http\Controllers;


class PagesController extends Controller
{
    public function index(){
        return view('index');
    }

    public function project(){
        return view('project');
    }
}
