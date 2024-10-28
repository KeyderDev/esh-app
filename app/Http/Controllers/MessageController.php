<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Message;
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
        \Log::info('Request data:', $request->all());

        $request->validate([
            'content' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $userId = Auth::id();
        $message = new Message();
        $message->content = $request->input('content') ?? '';

        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $image = $request->file('image');
            $message->image = $this->uploadImage($image);
        }

        $message->user_id = $userId;

        $channel->messages()->save($message);

        broadcast(new MessageSent($message->load('user')))->toOthers();

        return response()->json($message->load('user'), 201);
    }

    public function destroy(Channel $channel, Message $message)
    {
        if (Auth::id() !== $message->user_id) {
            return response()->json(['error' => 'No tienes permiso para eliminar este mensaje.'], 403);
        }

        $message->delete();

        // broadcast(new MessageSent(null, $message->id))->toOthers();

        return response()->json(['message' => 'Mensaje eliminado correctamente.'], 200);
    }

    protected function uploadImage($image)
    {
        if (is_null($image)) {
            \Log::error('No file was uploaded.');
            throw new \Exception('No file was uploaded.');
        }

        if ($image instanceof \Illuminate\Http\UploadedFile) {
            if ($image->isValid()) {
                return $image->store('images', 'public');
            } else {
                \Log::error('Uploaded file is not valid.');
                throw new \Exception('El archivo proporcionado no es válido.');
            }
        }

        \Log::error('Invalid file upload type.');
        throw new \Exception('El archivo proporcionado no es válido.');
    }

    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|file|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $image = $request->file('image');

        try {
            $imagePath = $this->uploadImage($image);
            return response()->json(['path' => $imagePath], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
