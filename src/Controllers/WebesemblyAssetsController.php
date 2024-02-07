<?php

namespace WebesemblyEditor\Controllers;

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

    public function editorLoading()
    {
        return $this->pretendResponseIsFile(__DIR__.'/../../dist/webesembly/loading-book.css', 'text/css');
    }

    public function elementsCss()
    {
        return $this->pretendResponseIsFile(__DIR__.'/../../dist/webesembly/webesembly-elements.css', 'text/css');
    }

}
