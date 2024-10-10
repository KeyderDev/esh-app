<?php

namespace App\Http\Controllers;

use App\Models\Channel; // Asegúrate de importar tu modelo Channel
use App\Models\Message; // Asegúrate de importar tu modelo Message
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\MessageSent;


class MessageController extends Controller
{

    public function index(Channel $channel)
    {
        return response()->json($channel->messages()->with('user')->get()); 
    }
    public function store(Request $request, Channel $channel)
    {
        $request->validate(['content' => 'required|string']);
    
        $userId = Auth::id();
        if (is_null($userId)) {
            \Log::debug('User ID is null, user is not authenticated.');
        } else {
            \Log::debug('Authenticated user ID: ' . $userId);
        }
    
        $message = new Message();
        $message->content = $request->content;
        $message->user_id = $userId; 
        $channel->messages()->save($message);
    
        // Emitir el evento
        broadcast(new MessageSent($message))->toOthers(); 
    
        return response()->json($message->load('user'), 201);
    }
    
    
    
}

