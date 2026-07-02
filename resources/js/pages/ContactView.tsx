import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';

// Animaciones: encabezado con fade-in, columnas (info + formulario) cayendo desde
// arriba con rebote, inputs con resplandor al enfocar, botón con hover/click,
// mensaje de confirmación con fade-in y links de canales con hover
const animationStyles = `
@keyframes headingFadeIn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes panelFallDown {
    0% {
        opacity: 0;
        transform: translateY(-80px);
    }
    70% {
        opacity: 1;
        transform: translateY(6px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes noticeFadeIn {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.contact-heading-animated {
    animation: headingFadeIn 0.5s ease-out both;
}

.contact-panel-animated {
    animation: panelFallDown 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}

.contact-channel-link-animated {
    transition: opacity 0.2s ease;
}
.contact-channel-link-animated:hover {
    opacity: 0.7;
}

.contact-input-animated {
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.contact-input-animated:focus {
    outline: none;
    border-color: ${brandTheme.orange};
    box-shadow: 0 0 0 3px rgba(199, 100, 42, 0.15);
}

.contact-notice-animated {
    animation: noticeFadeIn 0.3s ease-out both;
}

.contact-submit-btn-animated {
    transition: transform 0.2s ease, filter 0.2s ease;
}
.contact-submit-btn-animated:hover {
    transform: translateY(-2px);
    filter: brightness(1.06);
}
.contact-submit-btn-animated:active {
    transform: scale(0.98);
}
`;

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
            nextErrors.email = 'Ingresa un correo válido.';
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
            <style>{animationStyles}</style>

            <main style={{ maxWidth: 1040, margin: '0 auto', padding: '34px 16px 56px' }}>
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 20, alignItems: 'start' }}>
                    <div className="contact-panel-animated" style={{ animationDelay: '0s' }}>
                        <span className="contact-heading-animated" style={{ display: 'inline-block', color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Contáctanos</span>
                        <h1 className="contact-heading-animated" style={{ margin: '8px 0 10px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 42px)' }}>Soporte PetWord</h1>
                        <p className="contact-heading-animated" style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                            Envía tus dudas sobre acceso, productos, categorías o búsqueda del sitio.
                        </p>

                        <div style={{ marginTop: 18, background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, display: 'grid', gap: 8 }}>
                            <strong style={{ color: brandTheme.navy }}>Canales</strong>
                            <span>Correo: contacto@petword.test</span>
                            <a href="/chat" className="contact-channel-link-animated" style={{ color: brandTheme.orange, fontWeight: 700 }}>Abrir chat</a>
                            <a href="/ayuda" className="contact-channel-link-animated" style={{ color: brandTheme.orange, fontWeight: 700 }}>Ver ayuda</a>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="contact-panel-animated" style={{ background: '#fff', border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 22, display: 'grid', gap: 14, boxShadow: '0 16px 30px rgba(12, 40, 62, 0.10)', animationDelay: '0.1s' }}>
                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Nombre</span>
                            <input value={name} onChange={(event) => setName(event.target.value)} className="contact-input-animated" style={inputStyle} placeholder="Tu nombre" />
                            {errors.name ? <span style={{ color: '#a73333', fontSize: 13 }}>{errors.name}</span> : null}
                        </label>

                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Correo</span>
                            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="contact-input-animated" style={inputStyle} placeholder="correo@ejemplo.com" />
                            {errors.email ? <span style={{ color: '#a73333', fontSize: 13 }}>{errors.email}</span> : null}
                        </label>

                        <label style={{ display: 'grid', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: brandTheme.navyDeep }}>Mensaje</span>
                            <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="contact-input-animated" style={{ ...inputStyle, minHeight: 130, resize: 'vertical' }} placeholder="Escribe tu duda" />
                            {errors.message ? <span style={{ color: '#a73333', fontSize: 13 }}>{errors.message}</span> : null}
                        </label>

                        {notice ? (
                            <div className="contact-notice-animated" style={{ borderRadius: 12, padding: '12px 14px', background: '#eef7ef', color: '#1f5e29', border: '1px solid #b5d8b8' }}>
                                {notice}
                            </div>
                        ) : null}

                        <button type="submit" className="contact-submit-btn-animated" style={{ border: 'none', borderRadius: 12, padding: '14px 18px', background: brandTheme.orange, color: '#fff', fontSize: 15, fontWeight: 700 }}>
                            Envíar mensaje
                        </button>
                    </form>
                </section>
            </main>
        </PageLayout>
    );
}