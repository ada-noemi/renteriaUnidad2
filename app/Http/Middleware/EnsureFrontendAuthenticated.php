<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureFrontendAuthenticated
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()) {
            return $next($request);
        }

        Log::channel('security')->warning('security.protected_route.blocked', [
            'ip' => $request->ip(),
            'method' => $request->method(),
            'path' => $request->path(),
            'user_agent' => $request->userAgent(),
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Debes iniciar sesión para continuar.',
            ], 401);
        }

        return redirect('/registrar');
    }
}
