<?php

namespace App\Http\Middleware;

use Closure;

class CorsMiddleware
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        // Configura los encabezados CORS
        $response->headers->set('Access-Control-Allow-Origin', '*'); // Permite todas las orígenes
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Encabezados permitidos

        return $response;
    }
}
