<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthenticateWithApiToken
{
    public function handle($request, Closure $next, $guard = null)
    {
        $token = $request->header('Authorization');

        if ($token) {
            $token = str_replace('Bearer ', '', $token);
            $user = User::where('api_token', $token)->first();

            if ($user) {
                Auth::login($user);
                return $next($request);
            }
        }

        return response()->json(['message' => 'Unauthenticated.'], 401);
    }
}
