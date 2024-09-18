<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuthenticateWithApiToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Authorization');

        if ($token) {
            $token = str_replace('Bearer ', '', $token);
            Log::info('Token received: ' . $token);

            // Verificar si el token no está vacío y es correcto
            if (!empty($token)) {
                $user = User::where('api_token', $token)->first();

                if ($user) {
                    Auth::login($user);
                    Log::info('User authenticated: ' . $user->username); // Registro del usuario autenticado
                    return $next($request);
                } else {
                    Log::info('User not found for token: ' . $token);
                }
            } else {
                Log::warning('Empty token received.');
            }
        } else {
            Log::warning('Authorization header missing.');
        }

        return response()->json(['message' => 'Unauthenticated.'], 401);
    }
}
