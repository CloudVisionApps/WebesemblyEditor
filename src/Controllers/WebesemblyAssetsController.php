<?php

namespace WebesemblyEditor\Controllers;

use Livewire\Controllers\CanPretendToBeAFile;

class WebesemblyAssetsController
{
    use CanPretendToBeAFile;

    public function editor()
    {
        return $this->pretendResponseIsFile(__DIR__.'/../../dist/webesembly/webesembly-editor.js');
    }

    public function iframeCss()
    {
        return $this->pretendResponseIsFile(__DIR__.'/../../dist/webesembly/webesembly-iframe.css', 'text/css');
    }
}
