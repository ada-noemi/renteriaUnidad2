import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';

type RecoverResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

// Estilos de animación inyectados una sola vez (keyframes globales).
// Los mantenemos en un componente aparte para no repetir el <style> en cada render.
function AnimationStyles() {
    return (
        <style>{`
            @keyframes card-enter {
                from { opacity: 0; transform: translateY(16px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes shake {
                10%, 90% { transform: translateX(-1px); }
                20%, 80% { transform: translateX(2px); }
                30%, 50%, 70% { transform: translateX(-4px); }
                40%, 60% { transform: translateX(4px); }
            }
            @keyframes message-enter {
                from { opacity: 0; transform: translateY(-6px); max-height: 0; }
                to { opacity: 1; transform: translateY(0); max-height: 100px; }
            }
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .rec-card {
                animation: card-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
            }
            .rec-card.shake {
                animation: shake 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
            }
            .rec-field {
                transition: transform 0.15s ease;
            }
            .rec-input {
                transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
            }
            .rec-input:focus {
                outline: none;
                border-color: ${brandTheme.orange};
                box-shadow: 0 0 0 3px rgba(230, 126, 34, 0.15);
            }
            .rec-error-text {
                animation: fade-in 0.2s ease both;
            }
            .rec-message {
                animation: message-enter 0.35s ease both;
                overflow: hidden;
            }
            .rec-button {
                transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;
            }
            .rec-button:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(230, 126, 34, 0.35);
            }
            .rec-button:active:not(:disabled) {
                transform: translateY(0);
            }
            .rec-spinner {
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 2px solid rgba(255, 255, 255, 0.4);
                border-top-color: #fff;
                border-radius: 50%;
                animation: spin 0.7s linear infinite;
                margin-right: 8px;
                vertical-align: -2px;
            }
            .rec-link {
                transition: opacity 0.15s ease;
            }
            .rec-link:hover {
                opacity: 0.75;
            }

            @media (prefers-reduced-motion: reduce) {
                .rec-card, .rec-card.shake, .rec-message, .rec-error-text, .rec-button, .rec-input {
                    animation: none !important;
                    transition: none !important;
                }
            }
        `}</style>
    );
}

export default function PasswordRecoveryView() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [errors, setErrors] = React.useState<Record<string, string[]>>({});
    const [loading, setLoading] = React.useState(false);
    const [shake, setShake] = React.useState(false);

    // Dispara el "shake" de la tarjeta cada vez que aparecen errores nuevos.
    function triggerShake() {
        setShake(false);
        // Forzamos un reflow en el siguiente tick para poder re-disparar la animación
        requestAnimationFrame(() => setShake(true));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors: Record<string, string[]> = {};

        if (!email.includes('@')) {
            nextErrors.email = ['Ingresa un correo válido.'];
        }

        if (password.length < 8) {
            nextErrors.password = ['La contraseña debe tener al menos 8 caracteres.'];
        }

        if (password !== passwordConfirmation) {
            nextErrors.password_confirmation = ['Las contraseñas deben coincidir.'];
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setMessage('');
            triggerShake();
            return;
        }

        setLoading(true);
        setErrors({});
        setMessage('');

        try {
            const response = await fetch('/auth/recover-password', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });

            const data = (await response.json()) as RecoverResponse;

            if (!response.ok) {
                setErrors(data.errors ?? {});
                setMessage(data.message ?? 'No se pudo actualizar la contraseña.');
                triggerShake();
                return;
            }

            setMessage(data.message ?? 'Contraseña actualizada correctamente.');
            setPassword('');
            setPasswordConfirmation('');
        } catch {
            setMessage('No se pudo conectar con el servidor. Intenta de nuevo.');
            triggerShake();
        } finally {
            setLoading(false);
        }
    }

    function fieldError(name: string) {
        return errors[name]?.[0];
    }

    const inputStyle: React.CSSProperties = {
        width: '100%',
        borderRadius: 12,
        border: `1px solid ${brandTheme.border}`,
        padding: '12px 14px',
        fontSize: 15,
        color: brandTheme.text,
        background: '#fff',
        boxSizing: 'border-box',
    };

    return (
        <PageLayout>
            <AnimationStyles />
            <main style={{ minHeight: 'calc(100vh - 164px)', display: 'grid', placeItems: 'center', padding: 16, background: brandTheme.creamSoft }}>
                <section
                    className={`rec-card${shake ? ' shake' : ''}`}
                    onAnimationEnd={() => setShake(false)}
                    style={{ width: 'min(100%, 520px)', background: '#fff', border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 28, boxShadow: '0 18px 36px rgba(12, 40, 62, 0.12)' }}
                >
                    <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Recuperación</span>
                    <h1 style={{ margin: '8px 0 10px', color: brandTheme.navy, fontSize: 'clamp(26px, 5vw, 36px)' }}>Cambia tu contraseña</h1>
                    <p style={{ margin: '0 0 20px', color: brandTheme.muted, lineHeight: 1.7 }}>
                        Escribe el correo de tu cuenta y una nueva contraseña para volver a entrar.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 15 }}>
                        <label className="rec-field" style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Correo electrónico</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                style={inputStyle}
                                className="rec-input"
                                placeholder="correo@ejemplo.com"
                            />
                            {fieldError('email') ? <span className="rec-error-text" style={{ color: '#a73333', fontSize: 13 }}>{fieldError('email')}</span> : null}
                        </label>

                        <label className="rec-field" style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Nueva contraseña</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                style={inputStyle}
                                className="rec-input"
                                placeholder="mínimo 8 caracteres"
                            />
                            {fieldError('password') ? <span className="rec-error-text" style={{ color: '#a73333', fontSize: 13 }}>{fieldError('password')}</span> : null}
                        </label>

                        <label className="rec-field" style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Confirmar contraseña</span>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(event) => setPasswordConfirmation(event.target.value)}
                                style={inputStyle}
                                className="rec-input"
                                placeholder="Repite tu contraseña"
                            />
                            {fieldError('password_confirmation') ? <span className="rec-error-text" style={{ color: '#a73333', fontSize: 13 }}>{fieldError('password_confirmation')}</span> : null}
                        </label>

                        {message ? (
                            <div className="rec-message" style={{ borderRadius: 12, padding: '12px 14px', background: '#eef7ef', color: '#1f5e29', border: '1px solid #b5d8b8' }}>
                                {message}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={loading}
                            className="rec-button"
                            style={{ border: 'none', borderRadius: 12, padding: '14px 18px', background: brandTheme.orange, color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}
                        >
                            {loading ? <span className="rec-spinner" /> : null}
                            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                        </button>
                    </form>

                    <div style={{ marginTop: 18 }}>
                        <a href="/login" className="rec-link" style={{ color: brandTheme.orange, fontWeight: 700 }}>Volver al inicio de sesión</a>
                    </div>
                </section>
            </main>
        </PageLayout>
    );
}