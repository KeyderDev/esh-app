<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class UserStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;

    public function __construct($user)
    {
        $this->user = $user;

        Log::info('UserStatusChanged event created.', [
            'user_id' => $this->user['id'],
            'user_data' => $this->user,
        ]);
    }

    public function broadcastOn()
    {
        Log::info('Broadcasting on channel: user-status', [
            'channel_name' => 'user-status',
        ]);

        return new Channel('user-status');
    }

    public function broadcastWith()
    {
        $broadcastData = [
            'id' => $this->user['id'],
            'username' => $this->user['username'],
            'profile_picture' => $this->user['profile_picture'],
            'is_online' => $this->user['is_online'],
            'description' => $this->user['description'],
            'roles' => $this->user['roles'],
        ];

        Log::info('Broadcasting data:', $broadcastData);

        return $broadcastData;
    }
}
