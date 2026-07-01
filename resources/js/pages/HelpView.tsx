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
            <main style={{ maxWidth: 980, margin: '0 auto', padding: '34px 16px 56px' }}>
                <section style={{ display: 'grid', gap: 20 }}>
                    <div>
                        <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Ayuda</span>
                        <h1 style={{ margin: '8px 0 10px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 42px)' }}>Centro de ayuda PetWord</h1>
                        <p style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                            Resuelve dudas comunes y entra directo a las herramientas de soporte.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
                        <a href="/recuperacion" style={{ textDecoration: 'none', background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, color: brandTheme.text }}>
                            <strong style={{ display: 'block', color: brandTheme.navy, marginBottom: 8 }}>Recuperar cuenta</strong>
                            Cambia tu contraseña si no puedes entrar.
                        </a>
                        <a href="/chat" style={{ textDecoration: 'none', background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, color: brandTheme.text }}>
                            <strong style={{ display: 'block', color: brandTheme.navy, marginBottom: 8 }}>Chat de soporte</strong>
                            Pregunta por productos, búsqueda o acceso.
                        </a>
                        <a href="/contacto" style={{ textDecoration: 'none', background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, color: brandTheme.text }}>
                            <strong style={{ display: 'block', color: brandTheme.navy, marginBottom: 8 }}>Contacto</strong>
                            Envía un mensaje al equipo de PetWord.
                        </a>
                    </div>

                    <section style={{ background: '#fff', border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, display: 'grid', gap: 16, boxShadow: '0 12px 24px rgba(12, 40, 62, 0.08)' }}>
                        <div>
                            <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Soporte rápido</span>
                            <h2 style={{ margin: '6px 0 0', color: brandTheme.navy }}>Elige cómo continuar</h2>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: 14 }}>
                            <article style={{ background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 16, display: 'grid', gap: 12 }}>
                                <strong style={{ color: brandTheme.navy }}>Guía inmediata</strong>
                                <button type="button" onClick={handleQuickGuide} style={{ border: 'none', borderRadius: 8, padding: '12px 14px', background: brandTheme.navy, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                                    Obtener sugerencia
                                </button>
                                <span style={{ minHeight: 44, color: brandTheme.muted, lineHeight: 1.5 }}>{quickGuide || 'Selecciona una pregunta frecuente y recibe una sugerencia al momento.'}</span>
                            </article>

                            <article style={{ background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 16, display: 'grid', gap: 12 }}>
                                <strong style={{ color: brandTheme.navy }}>Disponibilidad de atención</strong>
                                <button type="button" onClick={handleAvailabilityCheck} disabled={checkingAvailability} style={{ border: 'none', borderRadius: 8, padding: '12px 14px', background: brandTheme.orange, color: '#fff', fontWeight: 700, cursor: checkingAvailability ? 'wait' : 'pointer', opacity: checkingAvailability ? 0.78 : 1 }}>
                                    {checkingAvailability ? 'Consultando...' : 'Consultar horario'}
                                </button>
                                <span style={{ minHeight: 44, color: brandTheme.muted, lineHeight: 1.5 }}>{availability || 'Consulta el tiempo estimado de respuesta del equipo.'}</span>
                            </article>
                        </div>
                    </section>

                    <section style={{ display: 'grid', gap: 10 }}>
                        <h2 style={{ color: brandTheme.navy, margin: 0 }}>Preguntas frecuentes</h2>
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <article key={faq.question} style={{ border: `1px solid ${brandTheme.border}`, borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                                        style={{ width: '100%', border: 'none', background: brandTheme.creamSoft, color: brandTheme.navy, textAlign: 'left', padding: '14px 16px', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        {faq.question}
                                    </button>
                                    {isOpen ? (
                                        <p style={{ margin: 0, padding: 16, color: brandTheme.muted, lineHeight: 1.7 }}>{faq.answer}</p>
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
