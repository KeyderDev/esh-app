<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; 
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        \Log::info('Registering user: ', $request->all());


        return response()->json(['message' => 'User registered successfully!'], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
            $user = Auth::user();
            $token = Str::random(60);
            $user->api_token = $token;
            $user->save();
            \Log::info('Token generated: ' . $token); 

            return response()->json([
                'message' => 'Login successful!',
                'token' => $token,
                'user' => $user,
            ]);
        }

        \Log::error('Login failed for username: ' . $request->username . ' with IP: ' . $request->ip());

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

}
