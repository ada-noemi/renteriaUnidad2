<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AttackDetection
{
    /**
     * Patrones de ataque comunes que detectar
     */
    protected array $attackPatterns = [
        // Path traversal
        'path_traversal' => [
            '\.\./',
            '\.\.\\',
            '%2e%2e/',
            '%2e%2e\\',
            '..%2f',
            '..%5c',
        ],
        // Command injection
        'command_injection' => [
            ';\s*cat\s',
            ';\s*wget\s',
            ';\s*curl\s',
            '|\s*nc\s',
            '`.*`',
            '\$\(.*\)',
        ],
        // Protocol handlers
        'protocol_handlers' => [
            'file://',
            'gopher://',
            'dict://',
            'php://',
            'phar://',
            'data://text/html',
        ],
        // LDAP injection
        'ldap_injection' => [
            '\*\s*\)',
            'ldapmodify',
            'ldapadd',
        ],
        // XXE (XML External Entity)
        '<!DOCTYPE.*SYSTEM',
        '<!ENTITY.*SYSTEM',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        // Verificar URL
        $this->checkUrl($request);

        // Verificar headers sospechosos
        $this->checkHeaders($request);

        // Verificar user agent sospechoso
        $this->checkUserAgent($request);

        return $next($request);
    }

    /**
     * Verifica la URL para patrones de ataque
     */
    private function checkUrl(Request $request): void
    {
        $url = $request->getRequestUri();
        $decodedUrl = urldecode($url);

        foreach ($this->attackPatterns['path_traversal'] as $pattern) {
            if (stripos($decodedUrl, $pattern) !== false) {
                $this->blockRequest('Path traversal attempt detected');
            }
        }

        foreach ($this->attackPatterns['command_injection'] as $pattern) {
            if (preg_match('/' . $pattern . '/i', $decodedUrl)) {
                $this->blockRequest('Command injection attempt detected');
            }
        }
    }

    /**
     * Verifica headers sospechosos
     */
    private function checkHeaders(Request $request): void
    {
        $suspiciousHeaders = [
            'X-Forwarded-For' => 5,  // Máximo 5 IPs
            'X-Forwarded-Host' => false,  // No debe existir multiple veces
            'X-Rewritten-URL' => false,  // Header peligroso
            'Referer' => true,  // Si existe, verificar
        ];

        foreach ($suspiciousHeaders as $header => $validate) {
            $value = $request->header($header);
            
            if ($header === 'X-Forwarded-For' && $value) {
                $ips = array_filter(array_map('trim', explode(',', $value)));
                if (count($ips) > $validate) {
                    $this->blockRequest('Suspicious X-Forwarded-For header');
                }
            }

            if ($header === 'Referer' && $value) {
                // Verificar que sea un referer válido
                if (!filter_var($value, FILTER_VALIDATE_URL)) {
                    \Log::warning('Invalid Referer header', ['referer' => $value]);
                }
            }
        }
    }

    /**
     * Verifica user agent sospechoso
     */
    private function checkUserAgent(Request $request): void
    {
        $userAgent = $request->header('User-Agent', '');

        // User agent vacío es sospechoso
        if (empty($userAgent)) {
            \Log::warning('Empty User-Agent', ['ip' => $request->ip()]);
        }

        // Detectar bots maliciosos comunes
        $maliciousBots = [
            'sqlmap',
            'nikto',
            'nmap',
            'masscan',
            'acunetix',
            'nessus',
            'openvas',
            'metasploit',
        ];

        foreach ($maliciousBots as $bot) {
            if (stripos($userAgent, $bot) !== false) {
                $this->blockRequest('Malicious bot detected: ' . $bot);
            }
        }
    }

    /**
     * Bloquea la solicitud
     */
    private function blockRequest(string $reason): void
    {
        \Log::error('Attack detected: ' . $reason, [
            'ip' => request()->ip(),
            'url' => request()->url(),
            'method' => request()->method(),
            'user_agent' => request()->header('User-Agent'),
        ]);

        abort(403, 'Access denied');
    }
}
