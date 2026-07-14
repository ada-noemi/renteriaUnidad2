<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class XssProtection
{
    /**
     * Patrones peligrosos de XSS
     */
    protected array $xssPatterns = [
        '/<script[^>]*>.*?<\/script>/is',
        '/javascript:/i',
        '/on\w+\s*=/i',
        '/<iframe/i',
        '/<object/i',
        '/<embed/i',
        '/<applet/i',
        '/<meta/i',
        '/<link/i',
        '/<style[^>]*>.*?<\/style>/is',
        '/<img[^>]*onerror/i',
        '/vbscript:/i',
        '/data:text\/html/i',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        // Validar entrada para XSS
        $this->validateXss($request->all());

        // Agregar header X-XSS-Protection (para navegadores antiguos)
        $response = $next($request);
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        return $response;
    }

    /**
     * Valida recursivamente un array en búsqueda de XSS
     */
    private function validateXss(array $data): void
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $this->validateXss($value);
                continue;
            }

            if (!is_string($value)) {
                continue;
            }

            $this->checkXssPatterns($key, $value);
        }
    }

    /**
     * Verifica patrones XSS en un valor
     */
    private function checkXssPatterns(string $key, string $value): void
    {
        foreach ($this->xssPatterns as $pattern) {
            if (preg_match($pattern, $value)) {
                \Log::warning('XSS Protection: Potential XSS attempt detected', [
                    'field' => $key,
                    'value' => substr($value, 0, 100),
                    'ip' => request()->ip(),
                    'url' => request()->url(),
                ]);

                // Sanitizar el valor removiendo el contenido peligroso
                if (preg_match('/<script/i', $value) || preg_match('/javascript:/i', $value)) {
                    // Para script tags, mejor rechazar directamente
                    abort(422, 'Invalid input detected');
                }
            }
        }
    }
}
