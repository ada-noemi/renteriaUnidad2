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

// Estilos de animación inyectados una sola vez (keyframes globales).
function AnimationStyles() {
    return (
        <style>{`
            @keyframes sr-header-enter {
                from { opacity: 0; transform: translateY(-8px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes sr-panel-enter {
                from { opacity: 0; transform: translateY(14px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes sr-card-enter {
                from { opacity: 0; transform: translateY(14px) scale(0.98); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes sr-badge-pop {
                0% { opacity: 0; transform: scale(0.7); }
                70% { transform: scale(1.06); }
                100% { opacity: 1; transform: scale(1); }
            }
            @keyframes sr-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.55; }
            }
            @keyframes sr-spin {
                to { transform: rotate(360deg); }
            }

            .sr-eyebrow {
                display: inline-block;
                animation: sr-header-enter 0.4s ease both;
            }
            .sr-title {
                animation: sr-header-enter 0.5s ease both;
                animation-delay: 0.05s;
            }
            .sr-subtitle {
                animation: sr-header-enter 0.5s ease both;
                animation-delay: 0.1s;
            }
            .sr-info-panel {
                animation: sr-panel-enter 0.4s ease both;
            }
            .sr-loading-panel {
                animation: sr-panel-enter 0.4s ease both;
            }
            .sr-loading-title {
                display: inline-flex;
                align-items: center;
                gap: 10px;
            }
            .sr-spinner {
                display: inline-block;
                width: 14px;
                height: 14px;
                border: 2px solid rgba(12, 40, 62, 0.2);
                border-top-color: ${brandTheme.orange};
                border-radius: 50%;
                animation: sr-spin 0.7s linear infinite;
                flex-shrink: 0;
            }
            .sr-loading-panel p {
                animation: sr-pulse 1.6s ease-in-out infinite;
            }
            .sr-section-title {
                animation: sr-header-enter 0.4s ease both;
            }
            .sr-page-link {
                animation: sr-panel-enter 0.4s ease both;
                transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
            }
            .sr-page-link:hover {
                transform: translateY(-3px) translateX(2px);
                box-shadow: 0 20px 30px rgba(12, 40, 62, 0.14);
                border-color: ${brandTheme.orange};
            }
            .sr-product-card {
                animation: sr-card-enter 0.4s ease both;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .sr-product-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 20px 30px rgba(12, 40, 62, 0.14);
            }
            .sr-product-badge {
                animation: sr-badge-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
            }
            .sr-product-price {
                transition: color 0.2s ease;
            }
            .sr-product-card:hover .sr-product-price {
                color: ${brandTheme.orange};
            }

            @media (prefers-reduced-motion: reduce) {
                .sr-eyebrow, .sr-title, .sr-subtitle, .sr-info-panel, .sr-loading-panel,
                .sr-loading-panel p, .sr-spinner, .sr-section-title, .sr-page-link,
                .sr-product-card, .sr-product-badge, .sr-product-price {
                    animation: none !important;
                    transition: none !important;
                }
            }
        `}</style>
    );
}

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
            <AnimationStyles />
            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '34px 16px 52px' }}>
                <section style={{ display: 'grid', gap: 18 }}>
                    <div>
                        <span className="sr-eyebrow" style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Búsqueda</span>
                        <h1 className="sr-title" style={{ margin: '8px 0 12px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 40px)' }}>Resultados del sitio</h1>
                        <p className="sr-subtitle" style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                            {hasQuery ? `Consulta: ${query}` : 'Ingresa un término en el buscador del encabezado para encontrar páginas y productos.'}
                        </p>
                    </div>

                    {hasQuery && !hasResults ? (
                        <section className="sr-info-panel" style={formCardStyle}>
                            <strong style={{ color: brandTheme.navy }}>No se encontraron coincidencias.</strong>
                            <p style={{ marginBottom: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                                Prueba con palabras como productos, gatos, croquetas, ayuda o contacto.
                            </p>
                        </section>
                    ) : null}

                    {hasQuery && !authLoading && !canSearchProducts && allMatchingProducts.length > 0 ? (
                        <section className="sr-info-panel" style={formCardStyle}>
                            <strong style={{ color: brandTheme.navy }}>Hay productos relacionados en el catálogo completo.</strong>
                            <p style={{ marginBottom: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                                Inicia sesión o regístrate para buscar también dentro de todas las categorías y productos privados del sitio.
                            </p>
                        </section>
                    ) : null}

                    {authLoading ? (
                        <section className="sr-loading-panel" style={formCardStyle}>
                            <strong className="sr-loading-title" style={{ color: brandTheme.navy }}>
                                <span className="sr-spinner" />
                                Verificando acceso al catálogo...
                            </strong>
                            <p style={{ marginBottom: 0, marginTop: 8, color: brandTheme.muted, lineHeight: 1.7 }}>
                                En unos segundos sabremos si esta búsqueda puede incluir todos los productos o solo el contenido público.
                            </p>
                        </section>
                    ) : null}

                    {pageResults.length > 0 ? (
                        <section style={{ display: 'grid', gap: 14 }}>
                            <h2 className="sr-section-title" style={{ margin: 0, color: brandTheme.navy }}>Páginas</h2>
                            <div style={{ display: 'grid', gap: 12 }}>
                                {pageResults.map((page, index) => (
                                    <a
                                        key={page.id}
                                        href={page.href}
                                        className="sr-page-link"
                                        style={{ ...formCardStyle, textDecoration: 'none', color: brandTheme.text, animationDelay: `${index * 0.06}s` }}
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
                            <h2 className="sr-section-title" style={{ margin: 0, color: brandTheme.navy }}>Productos</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                                {productResults.map((product, index) => (
                                    <article
                                        key={product.id}
                                        className="sr-product-card"
                                        style={{ ...formCardStyle, animationDelay: `${index * 0.06}s` }}
                                    >
                                        <span className="sr-product-badge" style={{ display: 'inline-block', background: brandTheme.navyDeep, color: brandTheme.creamSoft, borderRadius: 999, padding: '5px 10px', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                                            {product.category}
                                        </span>
                                        <strong style={{ display: 'block', fontSize: 18, color: brandTheme.navy }}>{product.name}</strong>
                                        <p className="sr-product-price" style={{ marginBottom: 0, color: brandTheme.muted }}>${product.price}.00</p>
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