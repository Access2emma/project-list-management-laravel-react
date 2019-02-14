<?php

namespace Tests\Feature;

use App\Project;
use App\Task;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    public function setUp(){
        parent::setUp();

        $this->user = factory('App\User')->create();
    }


    /** @test */
    public function unauthenticated_user_can_not_view_all_project(){
        $this->json('GET', '/api/projects')
            ->assertStatus(401);
            $this->assertGuest();
    }

    /** @test */
    public function unauthenticated_user_can_not_create_project(){
        $this->json('POST', '/api/projects')
            ->assertStatus(401);
        $this->assertGuest();
    }

    /** @test */
    public function authenticated_user_can_view_all_his_projects()
    {
        $project = factory('App\Project')->create(['user_id' => $this->user->id]);

        $this->actingAs($this->user)
            ->json('GET', '/api/projects')
            ->assertOk();
    }

    /** @test */
    public function it_throw_validation_error_when_authenticated_user_submitting_invalid_data(){
        $project_information = [
            'name' => 'Random project'
        ];

        $this->actingAs($this->user)->json('POST', '/api/projects', $project_information)
            ->assertJsonValidationErrors('description');

        $project_information = [
            'description' => 'Random project'
        ];

        $this->actingAs($this->user)->json('POST', '/api/projects', $project_information)
            ->assertJsonValidationErrors('name');

        $this->actingAs($this->user)->json('POST', '/api/projects', [])
            ->assertJsonValidationErrors(['name', 'description']);
    }
    
    /** @test */
    public function authenticated_user_can_create_project_successfully(){
        $project_information = factory(Project::class)->make()
            ->only(['name', 'description']);

        $this->actingAs($this->user)->json('POST', '/api/projects', $project_information)
            ->assertStatus(201);

        $this->assertDatabaseHas('projects', $project_information);
    }

    /** @test */
    public function authenticated_user_can_view_single_project(){
        $project = factory(Project::class)->create(['user_id' => $this->user->id]);

        $this->actingAs($this->user)->json('GET', "/api/projects/{$project->id}")
            ->assertOk()
            ->assertJson($project->toArray());
    }

    /** @test */
    public function it_404_when_viewing_unavailable_project(){
        $project = 100;

        $this->actingAs($this->user)->json('GET', "/api/projects/{$project}")
            ->assertNotFound();
    }

    /** @test */
    public function can_mark_incomplete_project_as_completed(){
        $project = factory(Project::class)->create();

        $this->json('PATCH', "/api/projects/{$project->id}")
            ->assertOk();

        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'completed' => true
        ]);
    }

    /** @test */
    public function completed_project_can_not_be_mark_completed(){
        $project = factory(Project::class)->create(['completed' => true]);

        $this->json('PATCH', "/api/projects/{$project->id}")
            ->assertNotFound();
    }

    /** @test */
    public function project_can_be_deleted(){
        $project = factory(Project::class)->create();

        $this->json('DELETE', "/api/projects/{$project->id}")
            ->assertOk();

        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    /** @test */
    public function delete_all_project_tasks_when_a_project_is_deleted(){
        $project = factory(Project::class)->create();
        factory(Task::class, 5)->create(['project_id' => $project->id]);

        $this->json('DELETE', "/api/projects/{$project->id}")
            ->assertOk();

        $this->assertDatabaseMissing('tasks', ['project_id' => $project->id]);
    }
}
