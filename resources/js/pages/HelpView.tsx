import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';

const faqs = [
    {
        question: '¿Cómo recupero mi contraseña?',
        answer: 'Entra a Recuperación, escribe el correo de tu cuenta y registra una nueva contraseña.',
    },
    {
        question: '¿Por qué no puedo ver productos o chat?',
        answer: 'Algunas secciones son privadas. Primero registra tu cuenta o inicia sesión.',
    },
    {
        question: '¿Cómo busco productos?',
        answer: 'Usa la barra de búsqueda del encabezado. Si inicias sesión también se incluyen productos del catálogo.',
    },
];

const asyncResponseTimes = ['menos de 1 hora', '2 horas', 'hoy mismo'];

// Animaciones: encabezado con fade-in, tarjetas de acceso rápido y de soporte
// cayendo desde arriba con hover, botones con hover/press, acordeón de FAQ con
// flecha que rota y respuesta que aparece con fade + slide-down
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

@keyframes cardFallDown {
    0% {
        opacity: 0;
        transform: translateY(-60px);
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

@keyframes answerSlideDown {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.help-heading-animated {
    animation: headingFadeIn 0.5s ease-out both;
}

.help-quicklink-animated {
    animation: cardFallDown 0.55s cubic-bezier(0.34, 1.4, 0.64, 1) both;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
}
.help-quicklink-animated:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 26px rgba(12, 40, 62, 0.12);
    background-color: #fff;
}

.help-support-panel-animated {
    animation: cardFallDown 0.55s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}

.help-support-card-animated {
    transition: box-shadow 0.25s ease;
}
.help-support-card-animated:hover {
    box-shadow: 0 12px 20px rgba(12, 40, 62, 0.1);
}

.help-action-btn-animated {
    transition: transform 0.2s ease, filter 0.2s ease;
}
.help-action-btn-animated:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.08);
}
.help-action-btn-animated:active:not(:disabled) {
    transform: scale(0.97);
}

.help-faq-article-animated {
    animation: cardFallDown 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}

.help-faq-question-animated {
    transition: background-color 0.2s ease;
}
.help-faq-question-animated:hover {
    background-color: #ecdfc7;
}

.help-faq-chevron-animated {
    display: inline-block;
    transition: transform 0.25s ease;
}
.help-faq-chevron-animated.open {
    transform: rotate(180deg);
}

.help-faq-answer-animated {
    animation: answerSlideDown 0.25s ease-out both;
}
`;

function getSupportPriority(selectedIndex: number) {
    const selectedFaq = faqs[selectedIndex] ?? faqs[0];
    return `Sugerencia inmediata: revisa primero "${selectedFaq.question}"`;
}

function checkSupportAvailability() {
    return new Promise<string>((resolve) => {
        window.setTimeout(() => {
            const nextTime = asyncResponseTimes[Math.floor(Math.random() * asyncResponseTimes.length)];
            resolve(`Tiempo estimado de respuesta: ${nextTime}.`);
        }, 900);
    });
}

export default function HelpView() {
    const [openIndex, setOpenIndex] = React.useState(0);
    const [quickGuide, setQuickGuide] = React.useState('');
    const [availability, setAvailability] = React.useState('');
    const [checkingAvailability, setCheckingAvailability] = React.useState(false);

    function handleQuickGuide() {
        setQuickGuide(getSupportPriority(openIndex));
    }

    async function handleAvailabilityCheck() {
        setCheckingAvailability(true);
        setAvailability('Consultando atención disponible...');

        const result = await checkSupportAvailability();

        setAvailability(result);
        setCheckingAvailability(false);
    }

    return (
        <PageLayout>
            <style>{animationStyles}</style>

            <main style={{ maxWidth: 980, margin: '0 auto', padding: '34px 16px 56px' }}>
                <section style={{ display: 'grid', gap: 20 }}>
                    <div className="help-heading-animated">
                        <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Ayuda</span>
                        <h1 style={{ margin: '8px 0 10px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 42px)' }}>Centro de ayuda PetWord</h1>
                        <p style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                            Resuelve dudas comunes y entra directo a las herramientas de soporte.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
                        <a href="/recuperacion" className="help-quicklink-animated" style={{ textDecoration: 'none', background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, color: brandTheme.text, animationDelay: '0s' }}>
                            <strong style={{ display: 'block', color: brandTheme.navy, marginBottom: 8 }}>Recuperar cuenta</strong>
                            Cambia tu contraseña si no puedes entrar.
                        </a>
                        <a href="/chat" className="help-quicklink-animated" style={{ textDecoration: 'none', background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, color: brandTheme.text, animationDelay: '0.08s' }}>
                            <strong style={{ display: 'block', color: brandTheme.navy, marginBottom: 8 }}>Chat de soporte</strong>
                            Pregunta por productos, búsqueda o acceso.
                        </a>
                        <a href="/contacto" className="help-quicklink-animated" style={{ textDecoration: 'none', background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, color: brandTheme.text, animationDelay: '0.16s' }}>
                            <strong style={{ display: 'block', color: brandTheme.navy, marginBottom: 8 }}>Contacto</strong>
                            Envía un mensaje al equipo de PetWord.
                        </a>
                    </div>

                    <section className="help-support-panel-animated" style={{ background: '#fff', border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, display: 'grid', gap: 16, boxShadow: '0 12px 24px rgba(12, 40, 62, 0.08)' }}>
                        <div>
                            <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Soporte rápido</span>
                            <h2 style={{ margin: '6px 0 0', color: brandTheme.navy }}>Elige cómo continuar</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 14 }}>
                            <article className="help-support-card-animated" style={{ background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 16, display: 'grid', gap: 12 }}>
                                <strong style={{ color: brandTheme.navy }}>Guía inmediata</strong>
                                <button type="button" onClick={handleQuickGuide} className="help-action-btn-animated" style={{ border: 'none', borderRadius: 8, padding: '12px 14px', background: brandTheme.navy, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                                    Obtener sugerencia
                                </button>
                                <span style={{ minHeight: 44, color: brandTheme.muted, lineHeight: 1.5 }}>{quickGuide || 'Selecciona una pregunta frecuente y recibe una sugerencia al momento.'}</span>
                            </article>

                            <article className="help-support-card-animated" style={{ background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 16, display: 'grid', gap: 12 }}>
                                <strong style={{ color: brandTheme.navy }}>Disponibilidad de atención</strong>
                                <button type="button" onClick={handleAvailabilityCheck} disabled={checkingAvailability} className="help-action-btn-animated" style={{ border: 'none', borderRadius: 8, padding: '12px 14px', background: brandTheme.orange, color: '#fff', fontWeight: 700, cursor: checkingAvailability ? 'wait' : 'pointer', opacity: checkingAvailability ? 0.78 : 1 }}>
                                    {checkingAvailability ? 'Consultando...' : 'Consultar horario'}
                                </button>
                                <span style={{ minHeight: 44, color: brandTheme.muted, lineHeight: 1.5 }}>{availability || 'Consulta el tiempo estimado de respuesta del equipo.'}</span>
                            </article>
                        </div>
                    </section>

                    <section style={{ display: 'grid', gap: 10 }}>
                        <h2 className="help-heading-animated" style={{ color: brandTheme.navy, margin: 0 }}>Preguntas frecuentes</h2>
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <article key={faq.question} className="help-faq-article-animated" style={{ border: `1px solid ${brandTheme.border}`, borderRadius: 8, background: '#fff', overflow: 'hidden', animationDelay: `${index * 0.08}s` }}>
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                        className="help-faq-question-animated"
                                        style={{ width: '100%', border: 'none', background: brandTheme.creamSoft, color: brandTheme.navy, textAlign: 'left', padding: '14px 16px', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}
                                    >
                                        <span>{faq.question}</span>
                                        <span className={`help-faq-chevron-animated${isOpen ? ' open' : ''}`}>▾</span>
                                    </button>
                                    {isOpen ? (
                                        <p className="help-faq-answer-animated" style={{ margin: 0, padding: 16, color: brandTheme.muted, lineHeight: 1.7 }}>{faq.answer}</p>
                                    ) : null}
                                </article>
                            );
                        })}
                    </section>
                </section>
            </main>
        </PageLayout>
    );
}