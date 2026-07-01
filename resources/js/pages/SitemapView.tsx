import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';

// Estilos de animación inyectados una sola vez (keyframes globales).
function AnimationStyles() {
    return (
        <style>{`
            @keyframes header-enter {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes card-enter {
                from { opacity: 0; transform: translateY(20px) scale(0.97); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes item-enter {
                from { opacity: 0; transform: translateX(-8px); }
                to { opacity: 1; transform: translateX(0); }
            }

            .sm-eyebrow {
                animation: header-enter 0.4s ease both;
            }
            .sm-title {
                animation: header-enter 0.5s ease both;
                animation-delay: 0.05s;
            }
            .sm-subtitle {
                animation: header-enter 0.5s ease both;
                animation-delay: 0.1s;
            }
            .sm-card {
                animation: card-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
                transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
            }
            .sm-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 14px 28px rgba(12, 40, 62, 0.12);
                border-color: ${brandTheme.orange};
            }
            .sm-item {
                animation: item-enter 0.35s ease both;
                transition: color 0.15s ease, transform 0.15s ease;
            }
            .sm-item:hover {
                color: ${brandTheme.orange};
                transform: translateX(2px);
            }

            @media (prefers-reduced-motion: reduce) {
                .sm-eyebrow, .sm-title, .sm-subtitle, .sm-card, .sm-item {
                    animation: none !important;
                    transition: none !important;
                }
            }
        `}</style>
    );
}

export default function SitemapView() {
    const blockStyle: React.CSSProperties = {
        background: brandTheme.creamSoft,
        border: `1px solid ${brandTheme.border}`,
        borderRadius: 18,
        padding: 22,
    };

    const sections = {
        principales: ['Inicio', 'Categorías', 'Productos', 'Promociones', 'Más vendidos'],
        secundarias: ['Perro', 'Gato', 'Peces', 'Aves', 'Pequeñas especies'],
        adicionales: ['Registrar', 'Buzón', 'Inicio de sesión', 'Ayuda', 'Contáctanos', 'Recuperación de contraseña', 'Chat', 'Mapa del sitio', 'Carrito estático', 'Búsqueda'],
    };

    return (
        <PageLayout>
            <AnimationStyles />
            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '34px 16px 52px' }}>
                <section style={{ display: 'grid', gap: 18 }}>
                    <div>
                        <span className="sm-eyebrow" style={{ display: 'inline-block', color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Mapa del sitio</span>
                        <h1 className="sm-title" style={{ margin: '8px 0 12px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 40px)' }}>Estructura general de PetWord</h1>
                        <p className="sm-subtitle" style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                            Esta página cumple con la evidencia de secciónes principales, secundarias y elementos adicionales de la navegación web.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
                        {Object.entries(sections).map(([key, items], cardIndex) => (
                            <section
                                key={key}
                                className="sm-card"
                                style={{ ...blockStyle, animationDelay: `${0.1 + cardIndex * 0.1}s` }}
                            >
                                <h2 style={{ marginTop: 0, color: brandTheme.navy }}>
                                    {key === 'principales' ? 'Secciónes principales' : key === 'secundarias' ? 'Secciónes secundarias' : 'Elementos adicionales'}
                                </h2>
                                <ul style={{ margin: 0, paddingLeft: 20, color: brandTheme.text, lineHeight: 1.9 }}>
                                    {items.map((item, itemIndex) => (
                                        <li
                                            key={item}
                                            className="sm-item"
                                            style={{ animationDelay: `${0.2 + cardIndex * 0.1 + itemIndex * 0.05}s` }}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>
                </section>
            </main>
        </PageLayout>
    );
}