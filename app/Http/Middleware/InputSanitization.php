<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InputSanitization
{
    /**
     * Lista de campos que NO deben ser sanitizados (ej: JSON, datos binarios)
     */
    protected array $skipSanitization = [
        'password_confirmation',
        'payload',
        'data',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        // Sanitizar todas las entradas GET, POST y REQUEST
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH'])) {
            $sanitized = $this->sanitizeArray($request->all());
            $request->merge($sanitized);
        }

        return $next($request);
    }

    /**
     * Sanitiza un array de datos
     */
    private function sanitizeArray(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            // No sanitizar ciertos campos
            if (in_array($key, $this->skipSanitization)) {
                $sanitized[$key] = $value;
                continue;
            }

            if (is_array($value)) {
                $sanitized[$key] = $this->sanitizeArray($value);
            } elseif (is_string($value)) {
                $sanitized[$key] = $this->sanitizeString($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    /**
     * Sanitiza una cadena de texto contra XSS
     */
    private function sanitizeString(string $value): string
    {
        // Remover caracteres nulos
        $value = str_replace("\0", '', $value);

        // Escapar HTML entities (no aplica htmlspecialchars aquí, ya que Laravel lo hace en Blade)
        // Aquí solo removemos scripts peligrosos en nivel de aplicación
        $value = $this->removeScriptTags($value);
        $value = $this->removeEventHandlers($value);

        // Remover caracteres de control peligrosos
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value);

        return $value;
    }

    /**
     * Remueve etiquetas de script
     */
    private function removeScriptTags(string $value): string
    {
        return preg_replace('/<script[^>]*>.*?<\/script>/is', '', $value);
    }

    /**
     * Remueve event handlers inline (onclick, onload, etc)
     */
    private function removeEventHandlers(string $value): string
    {
        return preg_replace('/on\w+\s*=\s*["\']?(?:[^"\'>\s])*["\'>/]/is', '', $value);
    }
}
