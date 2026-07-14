<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Validation\ValidationException;

class SqlInjectionProtection
{
    /**
     * Patrones peligrosos de SQL que se suelen usar en inyecciones
     */
    protected array $sqlPatterns = [
        '/(\bUNION\b.*?\bSELECT\b)/i',
        '/(\bSELECT\b.*?\bFROM\b.*?\bWHERE\b)/i',
        '/(\bDROP\b.*?\bTABLE\b)/i',
        '/(\bINSERT\b.*?\bINTO\b)/i',
        '/(\bUPDATE\b.*?\bSET\b)/i',
        '/(\bDELETE\b.*?\bFROM\b)/i',
        '/(\bEXEC\b.*?\()/i',
        '/(\bEXECUTE\b)/i',
        '/(--|#|\/\*|\*\/)/i',  // Comentarios SQL
        '/(\bOR\b\s+1\s*=\s*1)/i',
        '/(\bAND\b.*?\=.*?\s)/i',
        '/(CASE\s+WHEN|CAST|COALESCE|NULLIF|IFNULL)/i',
        '/(xp_|sp_|0x)/i',  // Stored procedures y hex encoding
    ];

    /**
     * Caracteres peligrosos en parámetros de query string
     */
    protected array $dangerousChars = ['%27', '%22', '--', '/*', '*/', 'xp_', 'sp_', '0x'];

    public function handle(Request $request, Closure $next): Response
    {
        // Validar query string
        if ($request->getQueryString()) {
            $this->validateQueryString($request->getQueryString());
        }

        // Validar datos POST/PUT/PATCH
        if (in_array($request->method(), ['POST', 'PUT', 'PATCH'])) {
            $this->validateInput($request->all());
        }

        return $next($request);
    }

    /**
     * Valida el query string contra patrones de SQL injection
     */
    private function validateQueryString(string $query): void
    {
        // Decodificar URL encoding
        $decoded = urldecode($query);

        foreach ($this->sqlPatterns as $pattern) {
            if (preg_match($pattern, $decoded)) {
                $this->blockRequest('SQL injection pattern detected in query string');
            }
        }

        // Verificar caracteres peligrosos
        foreach ($this->dangerousChars as $char) {
            if (stripos($decoded, $char) !== false) {
                // Permitir comillas en valores normales, pero no múltiples
                if ($char === '%27' || $char === '%22') {
                    if (substr_count($decoded, $char) > 2) {
                        $this->blockRequest('Suspicious quote patterns in query string');
                    }
                } else {
                    $this->blockRequest('Dangerous character detected: ' . $char);
                }
            }
        }
    }

    /**
     * Valida datos de entrada contra patrones de SQL injection
     */
    private function validateInput(array $data): void
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $this->validateInput($value);
                continue;
            }

            if (!is_string($value)) {
                continue;
            }

            // Buscar patrones de SQL injection
            foreach ($this->sqlPatterns as $pattern) {
                if (preg_match($pattern, $value)) {
                    $this->blockRequest("SQL injection pattern detected in field: $key");
                }
            }

            // Detectar múltiples comillas o apóstrofes (indicativo de inyección)
            $quotes = substr_count($value, "'") + substr_count($value, '"');
            if ($quotes > 3 && strlen($value) < 50) {
                $this->blockRequest("Suspicious quote patterns detected in field: $key");
            }
        }
    }

    /**
     * Bloquea la solicitud
     */
    private function blockRequest(string $reason): void
    {
        \Log::warning('SQL Injection Protection: ' . $reason, [
            'ip' => request()->ip(),
            'url' => request()->url(),
            'user_agent' => request()->header('User-Agent'),
        ]);

        throw ValidationException::withMessages([
            'security' => ['Request validation failed. Invalid input detected.'],
        ]);
    }
}
