<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Cache\RateLimiter;

class AdvancedRateLimiting
{
    /**
     * Límites de rate por tipo de solicitud
     */
    protected array $limits = [
        'auth_register' => '5:60',      // 5 por minuto
        'auth_login' => '5:60',         // 5 intentos por minuto
        'auth_recover' => '3:60',       // 3 intentos por minuto
        'api_default' => '60:60',       // 60 por minuto
    ];

    public function handle(Request $request, Closure $next): Response
    {
        // Determinar el tipo de solicitud
        $limitKey = $this->getLimitKey($request);
        
        if ($limitKey) {
            if (!$this->checkRateLimit($request, $limitKey)) {
                \Log::warning('Rate limit exceeded', [
                    'key' => $limitKey,
                    'ip' => $request->ip(),
                ]);

                return response()->json([
                    'message' => 'Demasiadas solicitudes. Intenta más tarde.',
                ], 429);
            }
        }

        return $next($request);
    }

    /**
     * Determina el tipo de solicitud para aplicar rate limit
     */
    private function getLimitKey(Request $request): ?string
    {
        $path = $request->path();

        if (str_contains($path, 'auth/register')) {
            return 'auth_register';
        }
        if (str_contains($path, 'auth/login')) {
            return 'auth_login';
        }
        if (str_contains($path, 'auth/recover-password')) {
            return 'auth_recover';
        }

        return null;
    }

    /**
     * Verifica el rate limit basado en IP y usuario
     */
    private function checkRateLimit(Request $request, string $limitKey): bool
    {
        $key = $limitKey . ':' . $request->ip();
        
        [$limit, $minutes] = explode(':', $this->limits[$limitKey]);

        $limiter = app(RateLimiter::class);
        
        if ($limiter->tooManyAttempts($key, (int) $limit)) {
            return false;
        }

        $limiter->hit($key, $minutes * 60);

        return true;
    }
}
