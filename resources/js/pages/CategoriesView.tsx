import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';
import { categories } from '../siteData';

const cardStyle: React.CSSProperties = {
    background: brandTheme.creamSoft,
    border: `1px solid ${brandTheme.border}`,
    borderRadius: 8,
    padding: 14,
    boxShadow: '0 12px 24px rgba(12, 40, 62, 0.08)',
};

const categoryLinks: Record<string, string> = {
    peces: '/categorias/peces',
    perros: '/categorias/perros',
    gatos: '/categorias/gatos',
    roedores: '/categorias/roedores',
    aves: '/categorias/aves',
    reptiles: '/categorias/reptiles',
};

export default function CategoriesView() {
    return (
        <PageLayout>
            <main style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 16px 52px' }}>
                <section style={{ marginBottom: 26 }}>
                    <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Categorías</span>
                    <h1 style={{ margin: '8px 0 12px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 40px)' }}>Indice de categorías</h1>
                </section>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 18 }}>
                    {categories.map((category) => (
                        <a
                            key={category.id}
                            href={categoryLinks[category.slug]}
                            style={{
                                ...cardStyle,
                                textDecoration: 'none',
                                color: brandTheme.text,
                                display: 'grid',
                                gap: 12,
                            }}
                        >
                            <div
                                style={{
                                    height: 190,
                                    display: 'grid',
                                    placeItems: 'center',
                                    background: '#fff',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    padding: 8,
                                }}
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                />
                            </div>
                            <strong style={{ color: brandTheme.navy, fontSize: 18, lineHeight: 1.25 }}>{category.name}</strong>
                            <span
                                style={{
                                    width: '100%',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 8,
                                    padding: '10px 12px',
                                    background: brandTheme.orange,
                                    color: '#fff',
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                }}
                            >
                                Ver productos
                            </span>
                        </a>
                    ))}
                </section>
            </main>
        </PageLayout>
    );
}
