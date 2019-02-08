<?php

use Faker\Generator as Faker;

$factory->define(App\Task::class, function (Faker $faker) {
    return [
        'title' => $faker->name,
        'description' => $faker->sentence,
        'project_id' => function(){
            return factory(\App\Project::class)->create()->id;
        }
    ];
});
