<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        return response()->json([
            'authenticated' => $request->user() !== null,
            'user' => $request->user()?->only(['id', 'name', 'email']),
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:120'],
            'email' => ['required', 'email', 'max:120', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'recaptcha_token' => ['required', 'string'],
            'recaptcha_action' => ['required', 'string'],
        ]);

        $this->verifyRecaptcha($request, 'auth_register');

        $user = User::query()->create([
            'name' => $payload['name'],
            'email' => $payload['email'],
            'password' => $payload['password'],
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Cuenta creada correctamente.',
            'user' => $user->only(['id', 'name', 'email']),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8'],
            'recaptcha_token' => ['required', 'string'],
            'recaptcha_action' => ['required', 'string'],
        ]);

        $this->verifyRecaptcha($request, 'auth_login');

        if (! Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            return response()->json([
                'message' => 'Las credenciales no son válidas.',
                'errors' => [
                    'email' => ['Las credenciales no son válidas.'],
                ],
            ], 422);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Sesión iniciada correctamente.',
            'user' => $request->user()?->only(['id', 'name', 'email']),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ]);
    }

    public function recoverPassword(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'email.exists' => 'No encontramos una cuenta con ese correo.',
        ]);

        User::query()
            ->where('email', $payload['email'])
            ->update([
                'password' => Hash::make($payload['password']),
            ]);

        return response()->json([
            'message' => 'Contrasena actualizada correctamente. Ya puedes iniciar sesion.',
        ]);
    }

    private function verifyRecaptcha(Request $request, string $expectedAction): void
    {
        $siteKey = config('services.recaptcha.site_key');
        $secretKey = config('services.recaptcha.secret_key');

        if (! $siteKey || ! $secretKey) {
            throw ValidationException::withMessages([
                'recaptcha' => ['reCAPTCHA v3 no está configurado en el servidor.'],
            ]);
        }

        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => $secretKey,
            'response' => $request->string('recaptcha_token')->toString(),
            'remoteip' => $request->ip(),
        ]);

        if (! $response->ok()) {
            throw ValidationException::withMessages([
                'recaptcha' => ['No se pudo validar reCAPTCHA con Google.'],
            ]);
        }

        $payload = $response->json();
        $score = (float) ($payload['score'] ?? 0);
        $action = (string) ($payload['action'] ?? '');
        $minimumScore = (float) config('services.recaptcha.minimum_score', 0.5);

        if (! ($payload['success'] ?? false) || $action !== $expectedAction || $score < $minimumScore) {
            throw ValidationException::withMessages([
                'recaptcha' => ['No se pudo validar la verificación humana. Intenta de nuevo.'],
            ]);
        }
    }
}
