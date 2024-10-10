<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;

class SpotifyController extends Controller
{
    public function redirectToSpotify()
    {
        Log::info('Accediendo a redirectToSpotify'); 

        $clientId = 'f6f7302758544954b25d1faba25da2c3';
        $redirectUri = 'http://192.168.0.10:90/auth/spotify/callback';
        $scope = 'user-read-private user-read-email';

        $url = "https://accounts.spotify.com/authorize?client_id={$clientId}&redirect_uri=" . urlencode($redirectUri) . "&scope=" . urlencode($scope) . "&response_type=code";

        Log::info('URL de redireccionamiento a Spotify: ' . $url); 

        return Redirect::to($url);
    }

    public function handleSpotifyCallback(Request $request)
    {
        Log::info('Código recibido de Spotify: ' . $request->query('code'));

        $code = $request->query('code');

        if (!$code) {
            Log::error('No se recibió el código de autorización.'); 
            return redirect('/settings'); 
        }

        $client = new Client();

        try {
            Log::info('Iniciando la solicitud de token a Spotify.'); 

            $response = $client->post('https://accounts.spotify.com/api/token', [
                'form_params' => [
                    'client_id' => env('SPOTIFY_CLIENT_ID'),
                    'client_secret' => env('SPOTIFY_CLIENT_SECRET'),
                    'grant_type' => 'authorization_code',
                    'redirect_uri' => env('SPOTIFY_REDIRECT_URI'),
                    'code' => $code,
                ],
            ]);

            $body = json_decode($response->getBody(), true);
            $accessToken = $body['access_token'];

            Log::info('Token de acceso obtenido: ' . $accessToken); 

            $user = $request->user();
            if (!$user) {
                Log::error('No se pudo obtener el usuario autenticado.'); 
                return redirect('/settings'); 
            }

            $user->spotify_access_token = $accessToken; 
            $user->save(); 
            Log::info('Token de acceso guardado en la base de datos para el usuario: ' . $user->id);

        } catch (\Exception $e) {
            Log::error('Error al obtener el token de acceso: ' . $e->getMessage()); 
            return redirect('/settings'); 
        }

        return redirect('/settings'); 
    }

    public function getCurrentSong(Request $request)
    {
        $accessToken = $request->user()->spotify_access_token; 

        $client = new Client();

        try {
            $response = $client->get('https://api.spotify.com/v1/me/player/currently-playing', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ],
            ]);

            $body = json_decode($response->getBody(), true);

            return response()->json($body);
        } catch (\Exception $e) {
            Log::error('Error al obtener la canción actual: ' . $e->getMessage());
            return response()->json(['error' => 'No se pudo obtener la canción actual.'], 500);
        }
    }

    public function getSpotifyToken(Request $request)
    {
        $user = $request->user();
        $token = $user->spotify_access_token; 

        return response()->json(['token' => $token]); 
    }


}
