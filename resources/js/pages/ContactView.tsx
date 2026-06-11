import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';

export default function ContactView() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [notice, setNotice] = React.useState('');
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const nextErrors: Record<string, string> = {};

        if (name.trim().length < 3) {
            nextErrors.name = 'Escribe al menos 3 caracteres.';
        }

        if (!email.includes('@')) {
            nextErrors.email = 'Ingresa un correo valido.';
        }

        if (message.trim().length < 10) {
            nextErrors.message = 'Describe tu duda con al menos 10 caracteres.';
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            setNotice('');
            return;
        }

        setNotice('Mensaje preparado correctamente. El equipo de PetWord puede dar seguimiento por correo.');
        setName('');
        setEmail('');
        setMessage('');
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
            <main style={{ maxWidth: 1040, margin: '0 auto', padding: '34px 16px 56px' }}>
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20, alignItems: 'start' }}>
                    <div>
                        <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Contactanos</span>
                        <h1 style={{ margin: '8px 0 10px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 42px)' }}>Soporte PetWord</h1>
                        <p style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                            Envia tus dudas sobre acceso, productos, categorias o busqueda del sitio.
                        </p>

                        <div style={{ marginTop: 18, background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, display: 'grid', gap: 8 }}>
                            <strong style={{ color: brandTheme.navy }}>Canales</strong>
                            <span>Correo: contacto@petword.test</span>
                            <a href="/chat" style={{ color: brandTheme.orange, fontWeight: 700 }}>Abrir chat</a>
                            <a href="/ayuda" style={{ color: brandTheme.orange, fontWeight: 700 }}>Ver ayuda</a>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={{ background: '#fff', border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 22, display: 'grid', gap: 14, boxShadow: '0 16px 30px rgba(12, 40, 62, 0.10)' }}>
                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Nombre</span>
                            <input value={name} onChange={(event) => setName(event.target.value)} style={inputStyle} placeholder="Tu nombre" />
                            {errors.name ? <span style={{ color: '#a73333', fontSize: 13 }}>{errors.name}</span> : null}
                        </label>

                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Correo</span>
                            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} placeholder="correo@ejemplo.com" />
                            {errors.email ? <span style={{ color: '#a73333', fontSize: 13 }}>{errors.email}</span> : null}
                        </label>

                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Mensaje</span>
                            <textarea value={message} onChange={(event) => setMessage(event.target.value)} style={{ ...inputStyle, minHeight: 130, resize: 'vertical' }} placeholder="Escribe tu duda" />
                            {errors.message ? <span style={{ color: '#a73333', fontSize: 13 }}>{errors.message}</span> : null}
                        </label>

                        {notice ? (
                            <div style={{ borderRadius: 12, padding: '12px 14px', background: '#eef7ef', color: '#1f5e29', border: '1px solid #b5d8b8' }}>
                                {notice}
                            </div>
                        ) : null}

                        <button type="submit" style={{ border: 'none', borderRadius: 12, padding: '14px 18px', background: brandTheme.orange, color: '#fff', fontSize: 15, fontWeight: 700 }}>
                            Enviar mensaje
                        </button>
                    </form>
                </section>
            </main>
        </PageLayout>
    );
}
