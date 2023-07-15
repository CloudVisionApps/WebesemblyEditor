<?php

namespace WebesemblyEditor\Controllers;

use Illuminate\Http\Request;
use WebesemblyEditor\Models\WebesemblySection;

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

    public function saveSection(Request $request)
    {
        $section = WebesemblySection::where('name', $request->get('name'))->first();
        if (!$section) {
            $section = new WebesemblySection();
            $section->name = $request->get('name');
        }
        $section->html = $request->get('html');
        $section->params = [];
        $section->save();

        \Artisan::call('view:clear');

        return response()->json(['success' => true]);
    }
}
