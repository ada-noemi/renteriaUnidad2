<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Headers básicos de seguridad - Prevención de Clickjacking
        $response->headers->set('X-Frame-Options', 'DENY');
        
        // Prevención de MIME type sniffing (previene XSS basado en type confusion)
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        
        // Política de referrer más estricta
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Restricción de permisos del navegador
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
        
        // Prevención de información sensible en URL
        $response->headers->set('X-Permitted-Cross-Domain-Policies', 'none');
        
        // Desabilitar DNS prefetch para proteger privacidad
        $response->headers->set('X-DNS-Prefetch-Control', 'off');
        
        // CSP más estricta - prevención fuerte de XSS
        $csp = "default-src 'self'; " .
            "script-src 'self' 'nonce-" . $this->getNonce() . "'; " .
            "style-src 'self' 'nonce-" . $this->getNonce() . "'; " .
            "img-src 'self' data: https:; " .
            "font-src 'self' data: https:; " .
            "connect-src 'self' https:; " .
            "frame-ancestors 'none'; " .
            "base-uri 'self'; " .
            "form-action 'self'; " .
            "object-src 'none'; " .
            "media-src 'self'; " .
            "child-src 'self'; " .
            "upgrade-insecure-requests; " .
            "block-all-mixed-content;";

        $response->headers->set('Content-Security-Policy', $csp);
        
        // Header CSP Report-Only para debugging
        $response->headers->set('Content-Security-Policy-Report-Only', $csp);
        
        // HSTS - Forzar HTTPS por 1 año
        if (request()->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        return $response;
    }

    /**
     * Genera un nonce para CSP
     */
    private function getNonce(): string
    {
        return base64_encode(bin2hex(random_bytes(16)));
    }
}