<?php


Route::namespace('WebesemblyEditor\Controllers')->group(function() {

    Route::get('/editor', 'WebesemblyEditorController@editor');
    Route::get('/editor-ui', 'WebesemblyEditorController@ui');

    Route::post('/webesembly/save-section', 'WebesemblyEditorController@saveSection');
    Route::post('/webesembly/reset-section', 'WebesemblyEditorController@resetSection');

    Route::get('/webesembly-editor/webesembly-editor.js', 'WebesemblyAssetsController@editor');
    Route::get('/webesembly-editor/webesembly-iframe.css', 'WebesemblyAssetsController@iframeCss');
    Route::get('/webesembly-editor/webesembly-elements.css', 'WebesemblyAssetsController@elementsCss');
    Route::get('/webesembly-editor/loading-book.css', 'WebesemblyAssetsController@editorLoading');

});
