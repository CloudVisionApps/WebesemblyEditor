<?php

namespace WebesemblyEditor\Controllers;

use Illuminate\Http\Request;
use WebesemblyEditor\Models\WebesemblyPage;
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

        $pageId = null;
        $pageName = $request->get('pageName', false);
        if (!empty($pageName)) {
            $findPage = WebesemblyPage::where('name', $pageName)->first();
            if (!$findPage) {
                $findPage = new WebesemblyPage();
                $findPage->name = $pageName;
                $findPage->params = [];
                $findPage->html = '';
                $findPage->save();
            }
            $pageId = $findPage->id;
        }


        $section = WebesemblySection::where('name', $request->get('name'))->where('page_id',$pageId)->first();
        if (!$section) {
            $section = new WebesemblySection();
            $section->name = $request->get('name');
            $section->page_id = $pageId;
        }

        $section->html = $request->get('html');
        $section->params = [];
        $section->save();

        \Artisan::call('view:clear');

        return response()->json(['success' => true]);
    }


    public function resetSection(Request $request)
    {

        $pageId = null;
        $pageName = $request->get('pageName', false);
        if (!empty($pageName)) {
            $findPage = WebesemblyPage::where('name', $pageName)->first();
            if (!$findPage) {
                $findPage = new WebesemblyPage();
                $findPage->name = $pageName;
                $findPage->params = [];
                $findPage->html = '';
                $findPage->save();
            }
            $pageId = $findPage->id;
        }


        $section = WebesemblySection::where('name', $request->get('name'))->where('page_id',$pageId)->first();
        if ($section) {
            $section->delete();
        }

        \Artisan::call('view:clear');

        return response()->json(['success' => true]);
    }
}
