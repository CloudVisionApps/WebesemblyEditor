<?php


Route::namespace('WebesemblyEditor\Controllers')->group(function() {

    Route::get('/editor', 'WebesemblyEditorController@editor');
    Route::get('/editor-ui', 'WebesemblyEditorController@ui');

    Route::post('/webesembly/save-page', 'WebesemblyEditorController@savePage');
    Route::post('/webesembly/reset-page', 'WebesemblyEditorController@resetPage');

    Route::post('/webesembly/save-section-favorite', 'WebesemblyEditorController@saveSectionFavorite');
//    Route::post('/webesembly/save-section', 'WebesemblyEditorController@saveSection');
//    Route::post('/webesembly/reset-section', 'WebesemblyEditorController@resetSection');
//    Route::post('/webesembly/delete-section', 'WebesemblyEditorController@deleteSection');

    Route::get('/webesembly-editor/webesembly-editor.js', 'WebesemblyAssetsController@editor');
    Route::get('/webesembly-editor/webesembly-iframe.css', 'WebesemblyAssetsController@iframeCss');
    Route::get('/webesembly-editor/webesembly-elements.css', 'WebesemblyAssetsController@elementsCss');
    Route::get('/webesembly-editor/loading-book.css', 'WebesemblyAssetsController@editorLoading');

});
