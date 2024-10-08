<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    public function index()
    {
        return Channel::with('messages.user')->get();
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255']);

        return Channel::create($request->all());
    }

    public function show(Channel $channel)
    {
        return $channel->load('messages.user');
    }

    public function destroy($id)
{
    $channel = Channel::find($id);

    if (!$channel) {
        return response()->json(['message' => 'Channel not found'], 404);
    }

    $channel->delete();
    return response()->json(['message' => 'Channel deleted successfully'], 200);
}

}
