<?php

namespace WebesemblyEditor\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebesemblyEditable extends Model
{
    use HasFactory;

    protected $fillable = [
        'editable_field_name',
        'params',
        'html',
    ];

}
