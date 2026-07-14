<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class SecurityRequestLogger
{
    /**
     * @var list<string>
     */
    private array $protectedPaths = [
        'buzon',
        'chat',
        'productos',
        'categorias/aves',
        'categorias/gatos',
        'categorias/peces',
        'categorias/perros',
        'categorias/reptiles',
        'categorias/roedores',
    ];

    /**
     * @var list<string>
     */
    private array $suspiciousPaths = [
        '.env',
        'admin',
        'administrator',
        'config',
        'database',
        'login.php',
        'phpmyadmin',
        'server-status',
        'wp-admin',
        'wp-login.php',
    ];

    /**
     * @var array<string, list<string>>
     */
    private array $sensitiveMethods = [
        'auth/logout' => ['POST'],
        'auth/login' => ['POST'],
        'auth/register' => ['POST'],
        'auth/recover-password' => ['POST'],
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $path = trim($request->path(), '/');

        if ($this->isProtectedPath($path) && ! $request->user()) {
            $this->logSecurityEvent('security.protected_route.denied', $request, [
                'attempted_path' => $path,
            ]);
        }

        if ($this->isSuspiciousPath($path)) {
            $this->logSecurityEvent('security.suspicious_route.scan', $request, [
                'attempted_path' => $path,
            ]);
        }

        if ($this->isInvalidSensitiveMethod($request, $path)) {
            $this->logSecurityEvent('security.invalid_sensitive_request', $request, [
                'attempted_path' => $path,
                'allowed_methods' => $this->sensitiveMethods[$path],
            ]);
        }

        return $next($request);
    }

    private function isProtectedPath(string $path): bool
    {
        return in_array($path, $this->protectedPaths, true);
    }

    private function isSuspiciousPath(string $path): bool
    {
        $normalizedPath = strtolower($path);

        foreach ($this->suspiciousPaths as $suspiciousPath) {
            if ($normalizedPath === $suspiciousPath || str_starts_with($normalizedPath, $suspiciousPath.'/')) {
                return true;
            }
        }

        return false;
    }

    private function isInvalidSensitiveMethod(Request $request, string $path): bool
    {
        return isset($this->sensitiveMethods[$path])
            && ! in_array($request->method(), $this->sensitiveMethods[$path], true);
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function logSecurityEvent(string $event, Request $request, array $context = []): void
    {
        Log::channel('security')->warning($event, array_merge([
            'ip' => $request->ip(),
            'method' => $request->method(),
            'path' => $request->path(),
            'user_agent' => $request->userAgent(),
        ], $context));
    }
}
