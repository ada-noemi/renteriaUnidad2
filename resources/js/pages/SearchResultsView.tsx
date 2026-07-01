import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';
import { products, sitePages } from '../siteData';

const formCardStyle: React.CSSProperties = {
    background: brandTheme.creamSoft,
    border: `1px solid ${brandTheme.border}`,
    borderRadius: 20,
    padding: 28,
    boxShadow: '0 18px 32px rgba(12, 40, 62, 0.1)',
};

export default function SearchResultsView({ canSearchProducts, authLoading }: { canSearchProducts: boolean; authLoading: boolean }) {
    const query = new URLSearchParams(window.location.search).get('q')?.trim() ?? '';
    const normalizedQuery = query.toLowerCase();
    const pageResults = normalizedQuery
        ? sitePages.filter((page) => `${page.title} ${page.description}`.toLowerCase().includes(normalizedQuery))
        : [];
    const allMatchingProducts = normalizedQuery
        ? products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(normalizedQuery))
        : [];
    const productResults = canSearchProducts ? allMatchingProducts : [];
    const hasQuery = query.length > 0;
    const hasResults = pageResults.length > 0 || productResults.length > 0;

    return (
        <PageLayout>
            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '34px 16px 52px' }}>
                <section style={{ display: 'grid', gap: 18 }}>
                    <div>
                        <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Búsqueda</span>
                        <h1 style={{ margin: '8px 0 12px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 40px)' }}>Resultados del sitio</h1>
                        <p style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                            {hasQuery ? `Consulta: ${query}` : 'Ingresa un término en el buscador del encabezado para encontrar páginas y productos.'}
                        </p>
                    </div>

                    {hasQuery && !hasResults ? (
                        <section style={formCardStyle}>
                            <strong style={{ color: brandTheme.navy }}>No se encontraron coincidencias.</strong>
                            <p style={{ marginBottom: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                                Prueba con palabras como productos, gatos, croquetas, ayuda o contacto.
                            </p>
                        </section>
                    ) : null}

                    {hasQuery && !authLoading && !canSearchProducts && allMatchingProducts.length > 0 ? (
                        <section style={formCardStyle}>
                            <strong style={{ color: brandTheme.navy }}>Hay productos relacionados en el catálogo completo.</strong>
                            <p style={{ marginBottom: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                                Inicia sesión o regístrate para buscar también dentro de todas las categorías y productos privados del sitio.
                            </p>
                        </section>
                    ) : null}

                    {authLoading ? (
                        <section style={formCardStyle}>
                            <strong style={{ color: brandTheme.navy }}>Verificando acceso al catálogo...</strong>
                            <p style={{ marginBottom: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                                En unos segundos sabremos si esta búsqueda puede incluir todos los productos o solo el contenido público.
                            </p>
                        </section>
                    ) : null}

                    {pageResults.length > 0 ? (
                        <section style={{ display: 'grid', gap: 14 }}>
                            <h2 style={{ margin: 0, color: brandTheme.navy }}>Páginas</h2>
                            <div style={{ display: 'grid', gap: 12 }}>
                                {pageResults.map((page) => (
                                    <a
                                        key={page.id}
                                        href={page.href}
                                        style={{ ...formCardStyle, textDecoration: 'none', color: brandTheme.text }}
                                    >
                                        <strong style={{ display: 'block', color: brandTheme.navy }}>{page.title}</strong>
                                        <span style={{ display: 'block', marginTop: 6, color: brandTheme.muted }}>{page.description}</span>
                                    </a>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    {productResults.length > 0 ? (
                        <section style={{ display: 'grid', gap: 14 }}>
                            <h2 style={{ margin: 0, color: brandTheme.navy }}>Productos</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                                {productResults.map((product) => (
                                    <article key={product.id} style={formCardStyle}>
                                        <span style={{ display: 'inline-block', background: brandTheme.navyDeep, color: brandTheme.creamSoft, borderRadius: 999, padding: '5px 10px', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                                            {product.category}
                                        </span>
                                        <strong style={{ display: 'block', fontSize: 18, color: brandTheme.navy }}>{product.name}</strong>
                                        <p style={{ marginBottom: 0, color: brandTheme.muted }}>${product.price}.00</p>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </section>
            </main>
        </PageLayout>
    );
}