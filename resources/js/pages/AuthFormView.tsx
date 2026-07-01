import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';

export type AuthMode = 'login' | 'register';

type AuthResponse = {
    message: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    errors?: Record<string, string[]>;
};

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
            'X-CSRF-TOKEN': getCsrfToken(),
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw data;
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
    const isRegister = mode === 'register';
    const [form, setForm] = React.useState<AuthFormState>({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    });
    const [errors, setErrors] = React.useState<Record<string, string[]>>({});
    const [message, setMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const notice = window.sessionStorage.getItem('auth_notice');

        if (notice) {
            setMessage(notice);
            window.sessionStorage.removeItem('auth_notice');
        }
    }, []);

    const submitLabel = isRegister ? 'Crear cuenta' : 'Iniciar sesión';

    function closeModal() {
        window.location.href = '/';
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors: Record<string, string[]> = {};

        if (isRegister && form.name.trim().length < 3) {
            nextErrors.name = ['Ingresa al menos 3 caracteres.'];
        }

        if (!form.email.includes('@')) {
            nextErrors.email = ['Ingresa un correo válido.'];
        }

        if (form.password.length < 8) {
            nextErrors.password = ['La contraseña debe tener al menos 8 caracteres.'];
        }

        if (isRegister && form.password !== form.passwordConfirmation) {
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
            const recaptchaAction = isRegister ? 'auth_register' : 'auth_login';
            const recaptchaToken = await executeRecaptcha(recaptchaAction);

            const payload = isRegister
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

            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const response = await postJson<AuthResponse>(endpoint, payload);

            setMessage(response.message);

            if (isRegister) {
                window.sessionStorage.setItem('auth_notice', 'Cuenta creada correctamente. Ahora puedes iniciar sesión.');
                window.location.href = '/login';
                return;
            }

            window.sessionStorage.setItem('auth_notice', 'Sesion iniciada correctamente.');
            window.location.href = '/buzon';
        } catch (error) {
            if (error instanceof Error) {
                setErrors({ recaptcha: [error.message] });
                setMessage(error.message);
            } else {
                const response = error as AuthResponse;
                setErrors(response.errors ?? {});
                setMessage(response.message ?? 'No se pudo completar la solicitud.');
            }
        } finally {
            setLoading(false);
        }
    }

    function fieldError(name: keyof AuthFormState | 'password_confirmation' | 'recaptcha') {
        return errors[name]?.[0];
    }

    return (
        <PageLayout>
            <main style={{ minHeight: 'calc(100vh - 164px)', position: 'relative', overflow: 'hidden' }}>
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at top left, rgba(199, 100, 42, 0.16), transparent 36%), linear-gradient(180deg, rgba(18, 58, 87, 0.08) 0%, rgba(247, 242, 232, 0.3) 100%)',
                    }}
                />

                <div
                    onClick={closeModal}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 30,
                        display: 'grid',
                        placeItems: 'center',
                        alignItems: 'start',
                        padding: 16,
                        overflowY: 'auto',
                        background: 'rgba(12, 40, 62, 0.22)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <section
                        onClick={(event) => event.stopPropagation()}
                        style={{
                            width: 'min(100%, 500px)',
                            position: 'relative',
                            padding: 32,
                            margin: '16px 0',
                            maxHeight: 'calc(100vh - 32px)',
                            overflowY: 'auto',
                            borderRadius: 24,
                            background: 'rgba(247, 242, 232, 0.98)',
                            border: `1px solid rgba(216, 203, 179, 0.9)`,
                            boxShadow: '0 28px 60px rgba(12, 40, 62, 0.24)',
                        }}
                    >
                        <a
                            href="/"
                            aria-label="Cerrar formulario"
                            onClick={(event) => {
                                event.preventDefault();
                                closeModal();
                            }}
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
                            ×
                        </a>

                        <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
                            {isRegister ? 'Registro' : 'Autenticación'}
                        </span>
                        <h1 style={{ margin: '8px 0 10px', color: brandTheme.navy, fontSize: 'clamp(28px, 4vw, 38px)', lineHeight: 1.15 }}>
                            {isRegister ? 'Crea tu cuenta' : 'Inicia sesión'}
                        </h1>
                        <div style={{ marginBottom: 18, borderRadius: 14, padding: '14px 16px', background: 'rgba(18, 58, 87, 0.05)', color: brandTheme.navy, fontWeight: 700 }}>
                            {isRegister ? 'Completa tus datos para crear tu usuario.' : 'Ingresa tu correo y contraseña para autenticarte.'}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                            {isRegister ? (
                                <label style={{ display: 'grid', gap: 8 }}>
                                    <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Nombre completo</span>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
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
                                    style={inputStyle}
                                    placeholder="Mínimo 8 caracteres"
                                />
                                {fieldError('password') ? <span style={{ color: '#a73333', fontSize: 13 }}>{fieldError('password')}</span> : null}
                            </label>

                            {isRegister ? (
                                <label style={{ display: 'grid', gap: 8 }}>
                                    <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Confirmar contraseña</span>
                                    <input
                                        type="password"
                                        value={form.passwordConfirmation}
                                        onChange={(event) => setForm((current) => ({ ...current, passwordConfirmation: event.target.value }))}
                                        style={inputStyle}
                                        placeholder="Repite tu contraseña"
                                    />
                                    {fieldError('password_confirmation') ? <span style={{ color: '#a73333', fontSize: 13 }}>{fieldError('password_confirmation')}</span> : null}
                                </label>
                            ) : null}

                            {fieldError('recaptcha') ? <span style={{ color: '#a73333', fontSize: 13 }}>{fieldError('recaptcha')}</span> : null}

                            {message ? (
                                <div style={{ borderRadius: 12, padding: '12px 14px', background: '#eef7ef', color: '#1f5e29', border: '1px solid #b5d8b8' }}>
                                    {message}
                                </div>
                            ) : null}

                            <button
                                type="submit"
                                disabled={loading}
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
                        </form>

                        <div style={{ marginTop: 18, color: brandTheme.muted, lineHeight: 1.7 }}>
                            {isRegister ? (
                                <span>
                                    ¿Ya tienes cuenta? <a href="/login" style={{ color: brandTheme.orange, fontWeight: 700 }}>Inicia sesión</a>
                                </span>
                            ) : (
                                <span>
                                    ¿Aún no tienes cuenta? <a href="/registrar" style={{ color: brandTheme.orange, fontWeight: 700 }}>Regístrate</a>
                                </span>
                            )}
                        </div>

                        {!isRegister ? (
                            <div style={{ marginTop: 8 }}>
                                <a href="/recuperacion" style={{ color: brandTheme.orange, fontWeight: 700 }}>Olvidé mi contraseña</a>
                            </div>
                        ) : null}

                        <div style={{ marginTop: 14, textAlign: 'center' }}>
                            <a
                                href="/"
                                onClick={(event) => {
                                    event.preventDefault();
                                    closeModal();
                                }}
                                style={{ color: brandTheme.muted, textDecoration: 'none', fontSize: 14 }}
                            >
                                Volver al inicio
                            </a>
                        </div>
                    </section>
                </div>
            </main>
        </PageLayout>
    );
}
