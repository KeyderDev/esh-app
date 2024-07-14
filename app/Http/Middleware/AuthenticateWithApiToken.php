<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthenticateWithApiToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Illuminate\Http\Response
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Authorization');

        if ($token) {
            $token = str_replace('Bearer ', '', $token);
            $user = User::where('api_token', $token)->first();

            if ($user) {
                Auth::login($user); // Autenticar al usuario
                return $next($request); // Continuar con la solicitud
            }
        }

        return response()->json(['message' => 'Unauthenticated.'], 401); // Respuesta no autenticada
    }
}
