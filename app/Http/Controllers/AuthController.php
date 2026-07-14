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
            'name' => [
                'required', 
                'string', 
                'min:3', 
                'max:120',
                'regex:/^[a-zA-Z0-9\s\.\-_áéíóúñü]+$/i'  // Solo caracteres seguros
            ],
            'email' => [
                'required', 
                'email', 
                'max:120', 
                'unique:users,email',
                'lowercase'
            ],
            'password' => [
                'required', 
                'string', 
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/'  // Debe tener mayúscula, minúscula, número y símbolo
            ],
            'recaptcha_token' => ['required', 'string'],
            'recaptcha_action' => ['required', 'string', 'in:auth_register'],
        ], [
            'name.regex' => 'El nombre contiene caracteres no permitidos.',
            'email.lowercase' => 'El email debe estar en minúsculas.',
            'password.regex' => 'La contraseña debe contener mayúscula, minúscula, número y símbolo especial.',
        ]);

        // Verificar reCAPTCHA
        $this->verifyRecaptcha($request, 'auth_register');

        // Usar prepared statements implícitamente
        try {
            $user = User::query()->create([
                'name' => trim($payload['name']),  // Trim para evitar espacios
                'email' => strtolower(trim($payload['email'])),
                'password' => Hash::make($payload['password']),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al crear usuario: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al crear la cuenta. Intenta de nuevo.',
            ], 500);
        }

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
            'email' => ['required', 'email', 'max:120'],
            'password' => ['required', 'string', 'min:8'],
            'recaptcha_token' => ['required', 'string'],
            'recaptcha_action' => ['required', 'string', 'in:auth_login'],
        ]);

        $this->verifyRecaptcha($request, 'auth_login');

        // Usar prepared statements - Laravel lo hace automáticamente con Auth::attempt
        if (! Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            // Registrar intento fallido para detectar fuerza bruta
            \Log::warning('Failed login attempt', [
                'email' => $request->email,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'Las credenciales no son válidas.',
                'errors' => [
                    'email' => ['Las credenciales no son válidas.'],
                ],
            ], 422);
        }

        // Regenerar session ID después de login exitoso
        $request->session()->regenerate();

        // Log de login exitoso
        \Log::info('User logged in', [
            'user_id' => $request->user()?->id,
            'ip' => $request->ip(),
        ]);

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
            'email' => [
                'required', 
                'email', 
                'max:120',
                'exists:users,email'
            ],
            'password' => [
                'required', 
                'string', 
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/'
            ],
        ], [
            'email.exists' => 'No encontramos una cuenta con ese correo.',
            'password.regex' => 'La contraseña debe contener mayúscula, minúscula, número y símbolo especial.',
        ]);

        try {
            // Usar prepared statements con bindings seguros
            User::query()
                ->where('email', strtolower(trim($payload['email'])))
                ->update([
                    'password' => Hash::make($payload['password']),
                ]);

            // Log de cambio de contraseña
            \Log::info('Password reset', [
                'email' => $payload['email'],
                'ip' => $request->ip(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al actualizar contraseña: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error al actualizar la contraseña. Intenta de nuevo.',
            ], 500);
        }

        return response()->json([
            'message' => 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.',
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

        // Validar que el token no esté vacío
        $token = $request->string('recaptcha_token')->toString();
        if (empty($token) || strlen($token) < 10) {
            throw ValidationException::withMessages([
                'recaptcha' => ['Token de reCAPTCHA inválido.'],
            ]);
        }

        // Validar que la acción sea la esperada
        $action = $request->string('recaptcha_action')->toString();
        if (empty($action)) {
            throw ValidationException::withMessages([
                'recaptcha' => ['Acción de reCAPTCHA inválida.'],
            ]);
        }

        try {
            // Usar timeout para evitar bloqueos prolongados
            $response = Http::timeout(5)
                ->retry(2, 100)  // Reintentar 2 veces con 100ms entre intentos
                ->asForm()
                ->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret' => $secretKey,
                    'response' => $token,
                    'remoteip' => $request->ip(),
                ]);

            if (! $response->ok()) {
                \Log::warning('reCAPTCHA API error: ' . $response->status(), [
                    'ip' => $request->ip(),
                ]);
                throw ValidationException::withMessages([
                    'recaptcha' => ['Error al validar reCAPTCHA. Intenta de nuevo.'],
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Error during reCAPTCHA verification: ' . $e->getMessage());
            throw ValidationException::withMessages([
                'recaptcha' => ['Error de conexión con reCAPTCHA. Intenta de nuevo.'],
            ]);
        }

        $payload = $response->json();
        
        // Validaciones de respuesta
        if (! ($payload['success'] ?? false)) {
            \Log::warning('reCAPTCHA validation failed', [
                'ip' => $request->ip(),
                'error_codes' => $payload['error-codes'] ?? [],
            ]);
            throw ValidationException::withMessages([
                'recaptcha' => ['Verificación de reCAPTCHA fallida. Por favor, intenta de nuevo.'],
            ]);
        }

        $score = (float) ($payload['score'] ?? 0);
        $responseAction = (string) ($payload['action'] ?? '');
        $challengeTimestamp = $payload['challenge_ts'] ?? null;
        $minimumScore = (float) config('services.recaptcha.minimum_score', 0.5);

        // Validar que la acción coincida
        if ($responseAction !== $expectedAction) {
            \Log::warning('reCAPTCHA action mismatch', [
                'expected' => $expectedAction,
                'received' => $responseAction,
                'ip' => $request->ip(),
            ]);
            throw ValidationException::withMessages([
                'recaptcha' => ['Acción de reCAPTCHA no coincide.'],
            ]);
        }

        // Validar que el timestamp no sea antiguo (más de 2 minutos)
        if ($challengeTimestamp) {
            $timestamp = strtotime($challengeTimestamp);
            if (time() - $timestamp > 120) {
                throw ValidationException::withMessages([
                    'recaptcha' => ['Token de reCAPTCHA expirado. Intenta de nuevo.'],
                ]);
            }
        }

        // Validar el score
        if ($score < $minimumScore) {
            \Log::warning('reCAPTCHA score below threshold', [
                'score' => $score,
                'threshold' => $minimumScore,
                'ip' => $request->ip(),
            ]);
            throw ValidationException::withMessages([
                'recaptcha' => ['No se pudo verificar que seas humano. Intenta de nuevo.'],
            ]);
        }
    }
}
