@extends('layouts.master')

@section('title', 'Welcome to Project Manager')

@section('content')
    <div class="container py-4">
        <a href="{{ url('/projects') }}">Project</a>
    </div>
@endsection