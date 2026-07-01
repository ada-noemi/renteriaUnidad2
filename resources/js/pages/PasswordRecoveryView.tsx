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

export default function PasswordRecoveryView() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [errors, setErrors] = React.useState<Record<string, string[]>>({});
    const [loading, setLoading] = React.useState(false);

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
                return;
            }

            setMessage(data.message ?? 'Contraseña actualizada correctamente.');
            setPassword('');
            setPasswordConfirmation('');
        } catch {
            setMessage('No se pudo conectar con el servidor. Intenta de nuevo.');
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
            <main style={{ minHeight: 'calc(100vh - 164px)', display: 'grid', placeItems: 'center', padding: 16, background: brandTheme.creamSoft }}>
                <section style={{ width: 'min(100%, 520px)', background: '#fff', border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 28, boxShadow: '0 18px 36px rgba(12, 40, 62, 0.12)' }}>
                    <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Recuperación</span>
                    <h1 style={{ margin: '8px 0 10px', color: brandTheme.navy, fontSize: 'clamp(26px, 5vw, 36px)' }}>Cambia tu contraseña</h1>
                    <p style={{ margin: '0 0 20px', color: brandTheme.muted, lineHeight: 1.7 }}>
                        Escribe el correo de tu cuenta y una nueva contraseña para volver a entrar.
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 15 }}>
                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Correo electrónico</span>
                            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} placeholder="correo@ejemplo.com" />
                            {fieldError('email') ? <span style={{ color: '#a73333', fontSize: 13 }}>{fieldError('email')}</span> : null}
                        </label>

                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Nueva contraseña</span>
                            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} placeholder="mínimo 8 caracteres" />
                            {fieldError('password') ? <span style={{ color: '#a73333', fontSize: 13 }}>{fieldError('password')}</span> : null}
                        </label>

                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Confirmar contraseña</span>
                            <input type="password" value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} style={inputStyle} placeholder="Repite tu contraseña" />
                            {fieldError('password_confirmation') ? <span style={{ color: '#a73333', fontSize: 13 }}>{fieldError('password_confirmation')}</span> : null}
                        </label>

                        {message ? (
                            <div style={{ borderRadius: 12, padding: '12px 14px', background: '#eef7ef', color: '#1f5e29', border: '1px solid #b5d8b8' }}>
                                {message}
                            </div>
                        ) : null}

                        <button type="submit" disabled={loading} style={{ border: 'none', borderRadius: 12, padding: '14px 18px', background: brandTheme.orange, color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>
                            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                        </button>
                    </form>

                    <div style={{ marginTop: 18 }}>
                        <a href="/login" style={{ color: brandTheme.orange, fontWeight: 700 }}>Volver al inicio de sesión</a>
                    </div>
                </section>
            </main>
        </PageLayout>
    );
}
