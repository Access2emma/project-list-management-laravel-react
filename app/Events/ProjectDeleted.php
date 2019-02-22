<?php

namespace App\Events;

use App\Project;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ProjectDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    /** @var \App\Project */
    public $project;

    /**
     * Create a new event instance.
     *
     * @param \App\Project $project
     */
    public function __construct(Project $project)
    {
        $this->project = $project;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('project');
    }

    public function broadcastAs(){
        return 'project.deleted';
    }
}
