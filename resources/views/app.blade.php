<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ESH - APP</title>

    <script>
    window.appUrl = '{{ env('APP_URL') }}';
    </script>

    @vite(['resources/js/app.js'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
