import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';

export default function SitemapView() {
    const blockStyle: React.CSSProperties = {
        background: brandTheme.creamSoft,
        border: `1px solid ${brandTheme.border}`,
        borderRadius: 18,
        padding: 22,
    };

    const sections = {
        principales: ['Inicio', 'Categorias', 'Productos', 'Promociones', 'Mas vendidos'],
        secundarias: ['Perro', 'Gato', 'Peces', 'Aves', 'Pequeñas Especies'],
        adicionales: ['Registrar', 'Buzon', 'Inicio de sesion', 'Ayuda', 'Contactanos', 'Recuperacion de contraseña', 'Chat', 'Mapa del sitio', 'Carrito estatico', 'Busqueda'],
    };

    return (
        <PageLayout>
            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '34px 16px 52px' }}>
                <section style={{ display: 'grid', gap: 18 }}>
                    <div>
                        <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Mapa del sitio</span>
                        <h1 style={{ margin: '8px 0 12px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 40px)' }}>Estructura general de PetWord</h1>
                        <p style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                            Esta página cumple con la evidencia de secciones principales, secundarias y elementos adicionales de la navegación web.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
                        {Object.entries(sections).map(([key, items]) => (
                            <section key={key} style={blockStyle}>
                                <h2 style={{ marginTop: 0, color: brandTheme.navy }}>
                                    {key === 'principales' ? 'Secciones principales' : key === 'secundarias' ? 'Secciones secundarias' : 'Elementos adicionales'}
                                </h2>
                                <ul style={{ margin: 0, paddingLeft: 20, color: brandTheme.text, lineHeight: 1.9 }}>
                                    {items.map((item) => (
                                        <li key={item}>{item}</li>
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