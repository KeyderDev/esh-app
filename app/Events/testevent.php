<?php

use App\Events\UserStatusChanged;

function sendTestEvent()
{
    $user = [
        'id' => 1,
        'username' => 'testuser',
        'profile_picture' => 'path/to/picture.jpg',
        'is_online' => true,
        'description' => 'Test user',
        'roles' => []
    ];

    event(new UserStatusChanged($user));
}
