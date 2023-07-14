<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Webesembly Editor') }}</title>

    <link rel="stylesheet" href="{{asset('webesembly-editor/loading-book.css')}}" />
    <script src="{{asset('webesembly-editor/webesembly-editor.js') . '?time='.time()}}"></script>
</head>
<body>
    <div id="webesembly-editor-app" class="w-screen h-screen">
        <webesembly-editor>
            <div class="book">
                <div class="book__page"></div>
                <div class="book__page"></div>
                <div class="book__page"></div>
            </div>
        </webesembly-editor>
    </div>
</body>
</html>
