import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';
import { categories } from '../siteData';

const cardStyle: React.CSSProperties = {
    background: brandTheme.creamSoft,
    border: `1px solid ${brandTheme.border}`,
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 18px 32px rgba(12, 40, 62, 0.1)',
};

const categoryDescriptions: Record<string, string> = {
    peces: 'Ya puedes entrar a la vista individual de Peces para mantener su catálogo separado.',
    perros: 'Desde aqui ya puedes entrar a la vista dedicada de Perros.',
    gatos: 'La categoría de Gatos ya tiene su propia pantalla con productos independientes.',
    roedores: 'La vista individual de Roedores ya quedó separada para mostrar su catálogo propio.',
    aves: 'La categoría de Aves ya tiene una vista individual separada.',
    reptiles: 'Reptiles ya cuenta con su pantalla individual para crecer con su propio catálogo.',
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
                    <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Categorias</span>
                    <h1 style={{ margin: '8px 0 12px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 40px)' }}>Indice de categorías</h1>
                    <p style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7, maxWidth: 760 }}>
                        Esta vista ahora funciona como entrada general. Cada categoria tendrá su propio archivo y su propia pantalla con productos independientes.
                    </p>
                </section>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
                    {categories.map((category) => (
                        <a
                            key={category.id}
                            href={categoryLinks[category.slug]}
                            style={{
                                ...cardStyle,
                                textDecoration: 'none',
                                color: brandTheme.text,
                                padding: '18px 16px',
                                display: 'grid',
                                gap: 12,
                            }}
                        >
                            <div style={{ height: 126, display: 'grid', placeItems: 'center', marginBottom: 10 }}>
                                <img src={category.image} alt={category.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div>
                                <strong style={{ color: brandTheme.navy, fontSize: 18 }}>{category.name}</strong>
                                <p style={{ margin: '8px 0 0', color: brandTheme.muted, lineHeight: 1.7 }}>{categoryDescriptions[category.slug]}</p>
                            </div>
                            <span style={{ color: category.slug === 'perros' ? brandTheme.orange : brandTheme.muted, fontWeight: 700 }}>
                                {`Entrar a la vista de ${category.name}`}
                            </span>
                        </a>
                    ))}
                </section>
            </main>
        </PageLayout>
    );
}