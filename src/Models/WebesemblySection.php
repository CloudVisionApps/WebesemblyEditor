<?php

namespace WebesemblyEditor\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebesemblySection extends Model
{
    use HasFactory;

    protected $casts = [
        'params' => 'array',
    ];

    protected $fillable = [
        'name',
        'params',
        'html',
    ];

}
