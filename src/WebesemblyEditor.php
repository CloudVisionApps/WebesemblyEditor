<?php

namespace WebesemblyEditor;

use Illuminate\Support\Facades\Http;

class WebesemblyEditor
{
    public function justDoIt()
    {
        $response = Http::get('https://inspiration.goprogram.ai/');

        return $response['quote'] . ' -' . $response['author'];
    }
}
