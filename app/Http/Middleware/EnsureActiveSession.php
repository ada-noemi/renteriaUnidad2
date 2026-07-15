<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveSession
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $sessionId = $request->session()->getId();

        if (! $user->active_session_id) {
            $user->forceFill(['active_session_id' => $sessionId])->save();

            return $next($request);
        }

        if ($user->active_session_id === $sessionId) {
            return $next($request);
        }

        Log::channel('security')->warning('security.multisession.rejected', [
            'user_id' => $user->id,
            'email' => $user->email,
            'ip' => $request->ip(),
            'path' => $request->path(),
            'user_agent' => $request->userAgent(),
        ]);

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Tu sesión fue cerrada porque se inició sesión en otro dispositivo.',
            ], 401);
        }

        return redirect('/login');
    }
}
