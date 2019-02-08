<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title', 'description'];

    protected $casts = ['completed' => 'integer'];

    public function scopeIncomplete($query){
        return $query->whereCompleted(false);
    }
}
