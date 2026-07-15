<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserType
{
    public function handle(Request $request, Closure $next, string ...$allowedTypes): Response
    {
        $user = $request->user();

        if ($user && in_array($user->user_type, $allowedTypes, true)) {
            return $next($request);
        }

        Log::channel('security')->warning('security.user_type.denied', [
            'user_id' => $user?->id,
            'email' => $user?->email,
            'user_type' => $user?->user_type,
            'allowed_types' => $allowedTypes,
            'ip' => $request->ip(),
            'method' => $request->method(),
            'path' => $request->path(),
            'user_agent' => $request->userAgent(),
        ]);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'No tienes permisos para acceder a esta sección.',
            ], 403);
        }

        return redirect('/');
    }
}
