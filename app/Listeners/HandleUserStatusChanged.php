<?php

namespace App\Listeners;

use App\Events\UserStatusChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserStatusChanged implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Handle the event.
     *
     * @param  \App\Events\UserStatusChanged  $event
     * @return void
     */
    public function handle(UserStatusChanged $event)
    {
        // Lógica para manejar el evento, por ejemplo, registrar en los logs
        \Log::info('Handling UserStatusChanged event for user ID: ' . $event->user->id);

        // Aquí puedes realizar otras acciones, como actualizar datos en la base de datos
    }
}
