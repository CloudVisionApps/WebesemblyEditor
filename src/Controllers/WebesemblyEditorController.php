<?php

namespace WebesemblyEditor\Controllers;

use Illuminate\Http\Request;
use WebesemblyEditor\Models\WebesemblyPage;
use WebesemblyEditor\Models\WebesemblySection;
use WebesemblyEditor\Models\WebesemblySectionFavorite;

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

    public function dev()
    {
        return view('webesembly-editor::dev');
    }

    public function ui()
    {
        return view('webesembly-editor::editor-ui');
    }

    public function resetPage(Request $request)
    {
        $pageName = $request->get('name', false);
        if (!empty($pageName)) {
            $findPage = WebesemblyPage::where('name', $pageName)->first();
            if ($findPage) {

                $sections = WebesemblySection::where('page_id', $findPage->id)->get();
                if (!empty($sections)) {
                    foreach ($sections as $section) {
                        $section->delete();
                    }
                }

                $findPage->delete();
            }
        }

        \Artisan::call('view:clear');

        return response()->json(['success' => true]);
    }

    public function savePage(Request $request)
    {
        $pageName = $request->get('name', false);
        if (!empty($pageName)) {
            $findPage = WebesemblyPage::where('name', $pageName)->first();
            if (!$findPage) {
                $findPage = new WebesemblyPage();
                $findPage->name = $pageName;
            }

            $findPage->params = [];
            $findPage->html = $request->get('html');
            $findPage->save();

            $sections = $request->get('sections', []);
            if (!empty($sections)) {
                foreach ($sections as $section) {

                    $sectionName = $section['name'];
                    $findSection = WebesemblySection::where('name', $sectionName)->where('page_id', $findPage->id)->first();
                    if (!$findSection) {
                        $findSection = new WebesemblySection();
                        $findSection->name = $sectionName;
                        $findSection->page_id = $findPage->id;
                    }

                    $findSection->html = $section['html'];
                    $findSection->params = [];
                    $findSection->save();
                }
            }

        }

        \Artisan::call('view:clear');

        return response()->json(['success' => true]);
    }

    public function saveSectionFavorite(Request $request)
    {
        $section = WebesemblySectionFavorite::where('name', $request->get('name'))->first();
        if (!$section) {
            $section = new WebesemblySectionFavorite();
            $section->name = $request->get('name');
        }

        $section->html = $request->get('html');
        $section->params = [];
        $section->save();

        return response()->json(['success' => true]);
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


    public function deleteSection(Request $request)
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
