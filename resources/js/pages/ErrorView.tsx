import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';

export default function ErrorView() {
    return (
        <PageLayout>
            <main style={{ maxWidth: 920, margin: '40px auto', padding: '0 16px 50px' }}>
                <section style={{ background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 20, padding: 28, textAlign: 'center', boxShadow: '0 12px 22px rgba(12, 40, 62, 0.08)' }}>
                    <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Página de error</span>
                    <h1 style={{ margin: '10px 0 12px', color: brandTheme.navy, fontSize: 'clamp(34px, 8vw, 72px)' }}>404</h1>
                    <p style={{ margin: '0 auto', maxWidth: 560, color: brandTheme.muted, lineHeight: 1.7 }}>
                        La sección solicitada no existe o fue movida. Usa el menú principal, la búsqueda del sitio o el mapa del sitio para regresar a una ruta válida.
                    </p>
                    <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href="/" style={{ textDecoration: 'none', background: brandTheme.orange, color: '#fff', borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>
                            Ir al inicio
                        </a>
                        <a href="/mapa-del-sitio" style={{ textDecoration: 'none', border: `1px solid ${brandTheme.border}`, color: brandTheme.navy, borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>
                            Ver mapa del sitio
                        </a>
                    </div>
                </section>
            </main>
        </PageLayout>
    );
}