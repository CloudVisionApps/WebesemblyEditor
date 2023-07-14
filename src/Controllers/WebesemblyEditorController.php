<?php

namespace WebesemblyEditor\Controllers;

class WebesemblyEditorController
{
    public function index()
    {
        return view('webesembly-editor::index');
    }

    public function editor()
    {
        return view('webesembly-editor::editor');
    }

    public function ui()
    {
        return view('webesembly-editor::editor-ui');
    }
}
