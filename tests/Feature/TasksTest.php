<?php

namespace Tests\Feature;

use App\Project;
use App\Task;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TasksTest extends TestCase
{
    use RefreshDatabase;

    private $task;

    public function setUp(){
        parent::setUp();

        $this->task = factory(Task::class)->make();
    }

    /** @test */
    public function task_can_be_created()
    {
        $this->json('POST', '/api/tasks', $this->task->toArray())
            ->assertStatus(201);

        $this->assertDatabaseHas('tasks', $this->task->toArray());
    }

    /** @test */
    public function task_cannot_be_created_for_invalid_project(){
        $task = factory(Task::class)->make(['project_id' => 10000]);

        $this->json('POST', '/api/tasks', $task->toArray())
            ->assertJsonValidationErrors('project_id');

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }

    /** @test */
    public function task_cannot_be_created_with_incomplete_info(){
        $task = factory(Task::class)->make(['title' => '']);

        $this->json('POST', '/api/tasks', $task->toArray())
            ->assertJsonValidationErrors('title');

        $task = factory(Task::class)->make(['description' => '']);

        $this->json('POST', '/api/tasks', $task->toArray())
            ->assertJsonValidationErrors('description');

        $task = factory(Task::class)->make(['project_id' => '']);

        $this->json('POST', '/api/tasks', $task->toArray())
            ->assertJsonValidationErrors('project_id');
    }

    /** @test */
    public function task_can_be_mark_as_completed(){
        $task = factory(Task::class)->create();

        $this->assertFalse((boolean) $task->completed);

        $this->json('PATCH', "/api/tasks/{$task->id}")
            ->assertOk();

        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'completed' => true
        ]);
    }
}
