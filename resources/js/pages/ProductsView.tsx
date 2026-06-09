import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';
import { products } from '../siteData';

const formCardStyle: React.CSSProperties = {
    background: brandTheme.creamSoft,
    border: `1px solid ${brandTheme.border}`,
    borderRadius: 20,
    padding: 28,
    boxShadow: '0 18px 32px rgba(12, 40, 62, 0.1)',
};

export default function ProductsView() {
    const petSections = [
        { slug: 'perro', title: 'Perro', description: 'Productos esenciales para alimentacion, juego y bienestar canino.' },
        { slug: 'gato', title: 'Gato', description: 'Accesorios y articulos de higiene para el cuidado felino.' },
        { slug: 'peces', title: 'Peces', description: 'Soluciones para acuarios, alimentacion y mantenimiento.' },
        { slug: 'aves', title: 'Aves', description: 'Jaulas, juguetes y articulos para aves de compania.' },
        { slug: 'pequenas-especies', title: 'Pequeñas especies', description: 'Productos para roedores y mascotas de habitat pequeno.' },
    ] as const;

    return (
        <PageLayout>
            <main style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 16px 52px' }}>
                <section style={{ marginBottom: 24 }}>
                    <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Catalogo</span>
                    <h1 style={{ margin: '8px 0 12px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 40px)' }}>Productos por tipo de mascota</h1>
                    <p style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7, maxWidth: 720 }}>
                        Cada seccion agrupa los productos segun el tipo de mascota del menu principal para que la navegacion y la busqueda lleven al usuario a un bloque concreto.
                    </p>
                </section>

                <div style={{ display: 'grid', gap: 26 }}>
                    {petSections.map((section) => {
                        const sectionProducts = products.filter((product) => product.petType === section.slug);

                        return (
                            <section key={section.slug} id={section.slug} style={{ display: 'grid', gap: 14, scrollMarginTop: 120 }}>
                                <div>
                                    <h2 style={{ margin: 0, color: brandTheme.navy }}>{section.title}</h2>
                                    <p style={{ margin: '6px 0 0', color: brandTheme.muted }}>{section.description}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                                    {sectionProducts.map((product) => (
                                        <article key={product.id} style={formCardStyle}>
                                            <span style={{ display: 'inline-block', background: brandTheme.navyDeep, color: brandTheme.creamSoft, borderRadius: 999, padding: '5px 10px', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                                                {product.category}
                                            </span>
                                            <strong style={{ display: 'block', fontSize: 18, color: brandTheme.navy }}>{product.name}</strong>
                                            <p style={{ margin: '8px 0 0', color: brandTheme.muted }}>${product.price}.00</p>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>
        </PageLayout>
    );
}