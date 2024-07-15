<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UserController extends Controller
{
    public function updateOnlineStatus(Request $request)
    {
        $request->validate(['is_online' => 'required|boolean']);
        $user = Auth::user();
        \Log::info('Attempting to update online status for user: ' . $user->id . ' to ' . $request->input('is_online'));
        $user->is_online = $request->input('is_online');
        \Log::info('User before save: ', $user->toArray());

        $saved = $user->save();
        \Log::info('User save result: ' . ($saved ? 'success' : 'failed'));

        
        \Log::info('Online status updated for user: ' . $user->id . ' to ' . $user->is_online);
        
    
        return response()->json(['message' => 'Status updated']);
    }
    

    public function getOnlineUsers()
    {   
        $users = User::where('is_online', true)->get(['id', 'username', 'profile_picture']);
        return response()->json($users);
    }

    public function getOfflineUsers()
    {
        $users = User::where('is_online', false)->get(['id', 'username', 'profile_picture']);
        return response()->json($users);
    }
}
