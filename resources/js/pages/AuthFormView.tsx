import React from 'react';
import { brandTheme } from '../theme';

export type AuthMode = 'login' | 'register';

type AuthResponse = {
    message: string;
    user?: {
        id: number;
        name: string;
        email: string;
        user_type?: 'cliente' | 'admin';
    };
    errors?: Record<string, string[]>;
};

class RequestError extends Error {
    errors?: Record<string, string[]>;

    constructor(message: string, errors?: Record<string, string[]>) {
        super(message);
        this.name = 'RequestError';
        this.errors = errors;
    }
}

type AuthFormState = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
};

type GrecaptchaInstance = {
    ready: (callback: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
    interface Window {
        grecaptcha?: GrecaptchaInstance;
    }
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

const animationStyles = `
@keyframes backdropFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes modalPopIn {
    0% {
        opacity: 0;
        transform: translateY(24px) scale(0.96);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes messageFadeIn {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.auth-backdrop-animated {
    animation: backdropFadeIn 0.25s ease-out both;
}

.auth-modal-animated {
    animation: modalPopIn 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}

.auth-close-btn-animated {
    transition: transform 0.25s ease, background-color 0.25s ease;
}

.auth-close-btn-animated:hover {
    transform: rotate(90deg);
    background-color: rgba(18, 58, 87, 0.12);
}

.auth-input-animated {
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.auth-input-animated:focus {
    outline: none;
    border-color: ${brandTheme.orange};
    box-shadow: 0 0 0 3px rgba(199, 100, 42, 0.15);
}

.auth-submit-btn-animated {
    transition: transform 0.2s ease, filter 0.2s ease;
}

.auth-submit-btn-animated:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.06);
}

.auth-submit-btn-animated:active:not(:disabled) {
    transform: scale(0.98);
}

.auth-message-animated {
    animation: messageFadeIn 0.3s ease-out both;
}

.auth-footer-link-animated {
    transition: opacity 0.2s ease;
}

.auth-footer-link-animated:hover {
    opacity: 0.75;
}

.auth-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(320px, 1fr) minmax(360px, 0.88fr);
    background: #08090c;
    color: ${brandTheme.creamSoft};
    font-family: Segoe UI, sans-serif;
    overflow: hidden;
}

.auth-brand-panel {
    position: relative;
    display: grid;
    align-items: center;
    padding: clamp(32px, 7vw, 96px);
    background:
        radial-gradient(circle at 12% 92%, rgba(239, 232, 216, 0.14), transparent 24%),
        radial-gradient(circle at 95% 6%, rgba(199, 100, 42, 0.22), transparent 22%),
        linear-gradient(135deg, #123a57 0%, #1c2630 54%, #2f1b1d 100%);
}

.auth-brand-panel::before,
.auth-brand-panel::after {
    content: "";
    position: absolute;
    border: 1px solid rgba(239, 232, 216, 0.11);
    border-radius: 50%;
    pointer-events: none;
}

.auth-brand-panel::before {
    width: 260px;
    height: 260px;
    left: -90px;
    bottom: -90px;
}

.auth-brand-panel::after {
    width: 210px;
    height: 210px;
    right: -42px;
    top: -42px;
}

.auth-form-panel {
    position: relative;
    display: grid;
    place-items: center;
    padding: clamp(20px, 5vw, 64px);
    background:
        radial-gradient(circle at 88% 12%, rgba(199, 100, 42, 0.23), transparent 28%),
        linear-gradient(135deg, #050608 0%, #0c0d10 58%, #1f0e0f 100%);
}

@media (max-width: 860px) {
    .auth-shell {
        grid-template-columns: 1fr;
    }

    .auth-brand-panel {
        min-height: 260px;
        padding: 32px 22px;
    }

    .auth-form-panel {
        min-height: calc(100vh - 260px);
        padding: 22px 14px 30px;
    }
}
`;

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

function getRecaptchaSiteKey() {
    return document.querySelector('meta[name="recaptcha-site-key"]')?.getAttribute('content') ?? '';
}

async function postJson<T>(url: string, payload: Record<string, unknown>): Promise<T> {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json')
        ? await response.json()
        : {
            message: response.ok
                ? 'Solicitud completada.'
                : 'No se pudo completar la solicitud. Verifica los datos e intenta de nuevo.',
        };

    if (!response.ok) {
        throw new RequestError(data.message ?? 'No se pudo completar la solicitud.', data.errors ?? {});
    }

    return data as T;
}

async function executeRecaptcha(action: 'auth_login' | 'auth_register') {
    const siteKey = getRecaptchaSiteKey();

    if (!siteKey) {
        throw new Error('reCAPTCHA v3 no está configurado.');
    }

    if (!window.grecaptcha) {
        throw new Error('reCAPTCHA v3 aún no terminó de cargar.');
    }

    return new Promise<string>((resolve, reject) => {
        window.grecaptcha?.ready(() => {
            window.grecaptcha?.execute(siteKey, { action }).then(resolve).catch(reject);
        });
    });
}

export default function AuthFormView({ mode }: { mode: AuthMode }) {
    const [activeMode, setActiveMode] = React.useState<AuthMode>(mode);
    const [isTransitioning, setIsTransitioning] = React.useState(false);
    const [form, setForm] = React.useState<AuthFormState>({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    });
    const [errors, setErrors] = React.useState<Record<string, string[]>>({});
    const [message, setMessage] = React.useState('');
    const [messageType, setMessageType] = React.useState<'success' | 'error'>('success');
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        setActiveMode(mode);

        const notice = window.sessionStorage.getItem('auth_notice');

        if (notice) {
            setMessage(notice);
            setMessageType('success');
            window.sessionStorage.removeItem('auth_notice');
        }
    }, [mode]);

    function closeModal() {
        window.location.href = '/';
    }

    function switchMode(nextMode: AuthMode) {
        if (nextMode === activeMode || isTransitioning || loading) {
            return;
        }

        setIsTransitioning(true);
        setErrors({});
        setMessage('');
        setMessageType('success');
        setActiveMode(nextMode);
        window.history.replaceState({}, '', nextMode === 'register' ? '/registrar' : '/login');
        window.setTimeout(() => setIsTransitioning(false), 850);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>, submitMode: AuthMode) {
        event.preventDefault();
        const isRegisterMode = submitMode === 'register';
        const nextErrors: Record<string, string[]> = {};

        if (isRegisterMode && form.name.trim().length < 3) {
            nextErrors.name = ['Ingresa al menos 3 caracteres.'];
        }

        if (!form.email.includes('@')) {
            nextErrors.email = ['Ingresa un correo válido.'];
        }

        if (form.password.length < 8) {
            nextErrors.password = ['La contraseña debe tener al menos 8 caracteres.'];
        }

        if (isRegisterMode && form.password !== form.passwordConfirmation) {
            nextErrors.password_confirmation = ['Las contraseñas deben coincidir.'];
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setMessage('');
            return;
        }

        setLoading(true);
        setErrors({});
        setMessage('');

        try {
            const recaptchaAction = isRegisterMode ? 'auth_register' : 'auth_login';
            const recaptchaToken = await executeRecaptcha(recaptchaAction);

            const payload = isRegisterMode
                ? {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    password_confirmation: form.passwordConfirmation,
                    recaptcha_token: recaptchaToken,
                    recaptcha_action: recaptchaAction,
                }
                : {
                    email: form.email,
                    password: form.password,
                    recaptcha_token: recaptchaToken,
                    recaptcha_action: recaptchaAction,
                };

            const endpoint = isRegisterMode ? '/auth/register' : '/auth/login';
            const response = await postJson<AuthResponse>(endpoint, payload);

            if (isRegisterMode && !response.user) {
                throw new RequestError('No se pudo crear la cuenta. Intenta de nuevo.');
            }

            setMessage(response.message);
            setMessageType('success');

            if (isRegisterMode) {
                window.sessionStorage.setItem('auth_notice', 'Cuenta creada correctamente. Ahora puedes iniciar sesión.');
                window.location.href = '/login';
                return;
            }

            window.sessionStorage.setItem('auth_notice', 'Sesión iniciada correctamente.');
            window.location.href = response.user?.user_type === 'admin' ? '/admin' : '/buzon';
        } catch (error) {
            if (error instanceof RequestError) {
                setErrors(error.errors ?? {});
                setMessage(Object.keys(error.errors ?? {}).length > 0 ? '' : error.message);
                setMessageType('error');
            } else if (error instanceof Error) {
                setErrors({ recaptcha: [error.message] });
                setMessage(error.message);
                setMessageType('error');
            } else {
                const response = error as AuthResponse;
                setErrors(response.errors ?? {});
                setMessage(response.message ?? 'No se pudo completar la solicitud.');
                setMessageType('error');
            }
        } finally {
            setLoading(false);
        }
    }

    function fieldError(name: keyof AuthFormState | 'password_confirmation' | 'recaptcha') {
        return errors[name]?.[0];
    }

    function renderFormContent(currentMode: AuthMode) {
        const isRegisterForm = currentMode === 'register';
        const submitLabel = isRegisterForm ? 'Crear cuenta' : 'Iniciar sesión';

        return (
            <div style={{ display: 'grid', gap: 16 }}>
                {isRegisterForm ? (
                    <label style={{ display: 'grid', gap: 8 }}>
                        <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Nombre completo</span>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                            className="auth-input-animated"
                            style={inputStyle}
                            placeholder="Ej. Andrea Ramírez"
                        />
                        {fieldError('name') ? <span style={{ color: '#a73333', fontSize: 13 }}>{fieldError('name')}</span> : null}
                    </label>
                ) : null}

                <label style={{ display: 'grid', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Correo electrónico</span>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                        className="auth-input-animated"
                        style={inputStyle}
                        placeholder="correo@ejemplo.com"
                    />
                    {fieldError('email') ? <span style={{ color: '#a73333', fontSize: 13 }}>{fieldError('email')}</span> : null}
                </label>

                <label style={{ display: 'grid', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Contraseña</span>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                        className="auth-input-animated"
                        style={inputStyle}
                        placeholder="Mínimo 8 caracteres"
                    />
                    {fieldError('password') ? <span style={{ color: '#a73333', fontSize: 13 }}>{fieldError('password')}</span> : null}
                </label>

                {isRegisterForm ? (
                    <label style={{ display: 'grid', gap: 8 }}>
                        <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Confirmar contraseña</span>
                        <input
                            type="password"
                            value={form.passwordConfirmation}
                            onChange={(event) => setForm((current) => ({ ...current, passwordConfirmation: event.target.value }))}
                            className="auth-input-animated"
                            style={inputStyle}
                            placeholder="Repite tu contraseña"
                        />
                        {fieldError('password_confirmation') ? <span style={{ color: '#a73333', fontSize: 13 }}>{fieldError('password_confirmation')}</span> : null}
                    </label>
                ) : null}

                {fieldError('recaptcha') ? <span style={{ color: '#a73333', fontSize: 13 }}>{fieldError('recaptcha')}</span> : null}

                {message ? (
                    <div
                        className="auth-message-animated"
                        style={{
                            borderRadius: 12,
                            padding: '12px 14px',
                            background: messageType === 'success' ? '#eef7ef' : '#fff0f0',
                            color: messageType === 'success' ? '#1f5e29' : '#a73333',
                            border: `1px solid ${messageType === 'success' ? '#b5d8b8' : '#e3b1b1'}`,
                        }}
                    >
                        {message}
                    </div>
                ) : null}

                <button
                    type="submit"
                    disabled={loading}
                    className="auth-submit-btn-animated"
                    style={{
                        border: 'none',
                        borderRadius: 14,
                        padding: '14px 18px',
                        background: brandTheme.orange,
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: loading ? 'wait' : 'pointer',
                    }}
                >
                    {loading ? 'Procesando...' : submitLabel}
                </button>

                <div style={{ color: brandTheme.muted, lineHeight: 1.7 }}>
                    {isRegisterForm ? (
                        <span>
                            ¿Ya tienes cuenta?{' '}
                            <button
                                type="button"
                                onClick={() => switchMode('login')}
                                style={{ background: 'transparent', border: 'none', color: brandTheme.orange, fontWeight: 700, padding: 0, cursor: 'pointer' }}
                            >
                                Inicia sesión
                            </button>
                        </span>
                    ) : (
                        <span>
                            ¿Aún no tienes cuenta?{' '}
                            <button
                                type="button"
                                onClick={() => switchMode('register')}
                                style={{ background: 'transparent', border: 'none', color: brandTheme.orange, fontWeight: 700, padding: 0, cursor: 'pointer' }}
                            >
                                Regístrate
                            </button>
                        </span>
                    )}
                </div>

                {!isRegisterForm ? (
                    <a href="/recuperacion" className="auth-footer-link-animated" style={{ color: brandTheme.orange, fontWeight: 700 }}>
                        Olvidé mi contraseña
                    </a>
                ) : null}
            </div>
        );
    }

    const cardRotation = activeMode === 'register' ? 0 : 180;

    return (
        <main className="auth-shell">
            <style>{animationStyles}</style>

            <section className="auth-brand-panel" aria-label="PetWord">
                <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 22, maxWidth: 520 }}>
                    <img
                        src="/images/pertword.png"
                        alt="PetWord"
                        style={{
                            width: 'min(420px, 72vw)',
                            height: 'auto',
                            filter: 'drop-shadow(0 22px 38px rgba(0, 0, 0, 0.32))',
                        }}
                    />
                </div>
            </section>

            <section className="auth-form-panel">
                <section
                    className="auth-modal-animated"
                    style={{
                        width: 'min(100%, 520px)',
                        position: 'relative',
                        padding: 'clamp(24px, 4vw, 34px)',
                        maxHeight: 'calc(100vh - 36px)',
                        overflowY: 'auto',
                        borderRadius: 18,
                        background: 'rgba(247, 242, 232, 0.98)',
                        border: `1px solid rgba(216, 203, 179, 0.34)`,
                        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.46)',
                    }}
                >
                    <a
                        href="/"
                        aria-label="Volver al inicio"
                        onClick={(event) => {
                            event.preventDefault();
                            closeModal();
                        }}
                        className="auth-close-btn-animated"
                        style={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            width: 36,
                            height: 36,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 999,
                            textDecoration: 'none',
                            color: brandTheme.navyDeep,
                            background: 'rgba(18, 58, 87, 0.06)',
                            fontSize: 20,
                            fontWeight: 700,
                        }}
                    >
                        x
                    </a>

                    <div style={{ display: 'grid', gap: 16 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center', paddingRight: 42 }}>
                            <div>
                                <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                                    {activeMode === 'register' ? 'Registro' : 'Acceso'}
                                </span>
                                <h2 style={{ margin: '8px 0 0', color: brandTheme.navy, fontSize: 'clamp(28px, 4vw, 38px)', lineHeight: 1.15 }}>
                                    {activeMode === 'register' ? 'Crea tu cuenta' : 'Iniciar sesión'}
                                </h2>
                            </div>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={() => switchMode('register')}
                                    style={{
                                        border: activeMode === 'register' ? `1px solid ${brandTheme.orange}` : '1px solid rgba(18, 58, 87, 0.14)',
                                        borderRadius: 999,
                                        padding: '8px 12px',
                                        background: activeMode === 'register' ? 'rgba(199, 100, 42, 0.14)' : 'rgba(18, 58, 87, 0.05)',
                                        color: brandTheme.navy,
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Registro
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchMode('login')}
                                    style={{
                                        border: activeMode === 'login' ? `1px solid ${brandTheme.orange}` : '1px solid rgba(18, 58, 87, 0.14)',
                                        borderRadius: 999,
                                        padding: '8px 12px',
                                        background: activeMode === 'login' ? 'rgba(199, 100, 42, 0.14)' : 'rgba(18, 58, 87, 0.05)',
                                        color: brandTheme.navy,
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Inicio
                                </button>
                            </div>
                        </div>

                        <div style={{ perspective: '1600px' }}>
                            <div
                                style={{
                                    position: 'relative',
                                    transformStyle: 'preserve-3d',
                                    transition: 'transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                    transform: `rotateY(${cardRotation}deg)`,
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(0deg)',
                                    }}
                                >
                                    <form onSubmit={(event) => handleSubmit(event, 'register')} style={{ display: 'grid', gap: 16 }}>
                                        {renderFormContent('register')}
                                    </form>
                                </div>

                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)',
                                    }}
                                >
                                    <form onSubmit={(event) => handleSubmit(event, 'login')} style={{ display: 'grid', gap: 16 }}>
                                        {renderFormContent('login')}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
        </main>
    );
}
