import React from 'react';
import { brandTheme } from '../theme';

// Estilos de animación inyectados una sola vez (keyframes globales).
function AnimationStyles() {
    return (
        <style>{`
            @keyframes ad-enter {
                from { opacity: 0; transform: translateY(24px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes ad-eyebrow {
                from { opacity: 0; transform: translateY(-6px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes ad-item {
                from { opacity: 0; transform: translateX(-8px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes ad-border-pulse {
                0%, 100% { border-color: ${brandTheme.orange}; }
                50% { border-color: rgba(230, 126, 34, 0.35); }
            }

            .ad-article {
                animation: ad-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
                transition: box-shadow 0.25s ease, transform 0.25s ease;
            }
            .ad-article:hover {
                transform: translateY(-3px);
                box-shadow: 0 16px 32px rgba(12, 40, 62, 0.1);
            }
            .ad-eyebrow {
                display: inline-block;
                animation: ad-eyebrow 0.4s ease both;
            }
            .ad-title {
                animation: ad-eyebrow 0.5s ease both;
                animation-delay: 0.05s;
            }
            .ad-text {
                animation: ad-eyebrow 0.5s ease both;
                animation-delay: 0.1s;
            }
            .ad-structure-box {
                animation: ad-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
                animation-delay: 0.1s;
                transition: transform 0.25s ease;
            }
            .ad-structure-box:hover {
                animation: ad-border-pulse 1.6s ease-in-out infinite;
                transform: translateY(-2px);
            }
            .ad-structure-title {
                animation: ad-eyebrow 0.4s ease both;
                animation-delay: 0.2s;
            }
            .ad-item {
                animation: ad-item 0.35s ease both;
                transition: color 0.15s ease, transform 0.15s ease;
            }
            .ad-item:hover {
                color: ${brandTheme.navy};
                transform: translateX(3px);
            }

            @media (prefers-reduced-motion: reduce) {
                .ad-article, .ad-eyebrow, .ad-title, .ad-text, .ad-structure-box,
                .ad-structure-title, .ad-item {
                    animation: none !important;
                    transition: none !important;
                }
            }
        `}</style>
    );
}

export default function AdoptionSection() {
    const structureItems = [
        'Listado de mascotas disponibles',
        'Ficha rápida por mascota',
        'Requisitos de adopción',
        'Formulario o botón de contacto',
    ];

    return (
        <section id="adopciones" style={{ marginBottom: 28 }}>
            <AnimationStyles />
            <article
                className="ad-article"
                style={{
                    background: `linear-gradient(135deg, ${brandTheme.creamSoft} 0%, ${brandTheme.cream} 100%)`,
                    borderRadius: 22,
                    border: `1px solid ${brandTheme.border}`,
                    padding: 24,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 18,
                    alignItems: 'center',
                }}
            >
                <div>
                    <span className="ad-eyebrow" style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Adopciones</span>
                    <h3 className="ad-title" style={{ margin: '8px 0 10px', color: brandTheme.navy, fontSize: 'clamp(24px, 4vw, 32px)' }}>Apartado de adopciones dentro del Home</h3>
                    <p className="ad-text" style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                        Este es el espacio para mostrar mascotas disponibles, requisitos y contacto para iniciar el proceso de adopción.
                    </p>
                </div>

                <div className="ad-structure-box" style={{ background: brandTheme.creamSoft, borderRadius: 16, border: `1px dashed ${brandTheme.orange}`, padding: 18 }}>
                    <strong className="ad-structure-title" style={{ display: 'block', marginBottom: 8, color: brandTheme.navy }}>Estructura sugerida</strong>
                    <ul style={{ margin: 0, paddingLeft: 18, color: brandTheme.muted, lineHeight: 1.8 }}>
                        {structureItems.map((item, index) => (
                            <li
                                key={item}
                                className="ad-item"
                                style={{ animationDelay: `${0.25 + index * 0.08}s` }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </article>
        </section>
    );
}