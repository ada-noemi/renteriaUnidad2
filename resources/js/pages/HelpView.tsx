import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';

const faqs = [
    {
        question: 'Como recupero mi contrasena?',
        answer: 'Entra a Recuperacion, escribe el correo de tu cuenta y registra una nueva contrasena.',
    },
    {
        question: 'Por que no puedo ver productos o chat?',
        answer: 'Algunas secciones son privadas. Primero registra tu cuenta o inicia sesion.',
    },
    {
        question: 'Como busco productos?',
        answer: 'Usa la barra de busqueda del encabezado. Si inicias sesion tambien se incluyen productos del catalogo.',
    },
];

export default function HelpView() {
    const [openIndex, setOpenIndex] = React.useState(0);

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
                            Cambia tu contrasena si no puedes entrar.
                        </a>
                        <a href="/chat" style={{ textDecoration: 'none', background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, color: brandTheme.text }}>
                            <strong style={{ display: 'block', color: brandTheme.navy, marginBottom: 8 }}>Chat de soporte</strong>
                            Pregunta por productos, busqueda o acceso.
                        </a>
                        <a href="/contacto" style={{ textDecoration: 'none', background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 8, padding: 18, color: brandTheme.text }}>
                            <strong style={{ display: 'block', color: brandTheme.navy, marginBottom: 8 }}>Contacto</strong>
                            Envia un mensaje al equipo de PetWord.
                        </a>
                    </div>

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
