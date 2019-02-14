<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function project_has_many_task()
    {
        $project = factory('App\Project')->create();
        $tasks = factory('App\Task', 3)->create(['project_id' => $project->id]);

        $this->assertEquals($project->tasks->count(), $tasks->count());
    }
}
