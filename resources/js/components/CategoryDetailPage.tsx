import React from 'react';
import PageLayout from './PageLayout';
import { brandTheme } from '../theme';
import type { Product } from '../siteData';

const pageCardStyle: React.CSSProperties = {
    background: brandTheme.creamSoft,
    border: `1px solid ${brandTheme.border}`,
    borderRadius: 20,
    padding: 24,
    boxShadow: '0 18px 32px rgba(12, 40, 62, 0.1)',
};

const animationStyles = `
@keyframes cardFadeUp {
    from {
        opacity: 0;
        transform: translateY(18px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes panelFadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes badgePop {
    0% { opacity: 0; transform: scale(0.7); }
    70% { transform: scale(1.06); }
    100% { opacity: 1; transform: scale(1); }
}

@keyframes ctaEnter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}

.product-card-animated {
    animation: cardFadeUp 0.5s ease-out both;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.product-card-animated:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 30px rgba(12, 40, 62, 0.16);
}

.product-image-wrap-animated {
    overflow: hidden;
}
.product-image-animated {
    transition: transform 0.35s ease;
}
.product-card-animated:hover .product-image-animated {
    transform: scale(1.06);
}

.product-badge-animated {
    animation: badgePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.product-price-animated {
    transition: color 0.2s ease;
}
.product-card-animated:hover .product-price-animated {
    color: ${brandTheme.orange};
}

.add-cart-btn-animated {
    transition: filter 0.25s ease, transform 0.15s ease;
}
.add-cart-btn-animated:hover {
    filter: brightness(1.08);
}
.add-cart-btn-animated:active {
    transform: scale(0.97);
}

.info-panel-animated {
    animation: panelFadeIn 0.5s ease-out both;
}

.cta-link-animated {
    animation: ctaEnter 0.4s ease both;
    animation-delay: 0.15s;
    transition: transform 0.2s ease, filter 0.2s ease, background-color 0.2s ease;
}
.cta-link-animated:hover {
    transform: translateY(-2px);
    filter: brightness(1.06);
}
.cta-link-outline-animated {
    animation: ctaEnter 0.4s ease both;
    animation-delay: 0.22s;
    transition: transform 0.2s ease, background-color 0.2s ease;
}
.cta-link-outline-animated:hover {
    transform: translateY(-2px);
    background-color: rgba(12, 40, 62, 0.05);
}

@media (prefers-reduced-motion: reduce) {
    .product-card-animated,
    .product-image-animated,
    .product-badge-animated,
    .product-price-animated,
    .add-cart-btn-animated,
    .info-panel-animated,
    .cta-link-animated,
    .cta-link-outline-animated {
        animation: none !important;
        transition: none !important;
    }
}
`;

type CategoryDetailPageProps = {
    title: string;
    description: string;
    isAuthenticated: boolean;
    products: Product[];
    registerMessage: string;
};

export default function CategoryDetailPage({
    title,
    isAuthenticated,
    products,
    registerMessage,
}: CategoryDetailPageProps) {
    return (
        <PageLayout>
            <style>{animationStyles}</style>

            <main style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 16px 52px' }}>
                {isAuthenticated ? (
                    products.length > 0 ? (
                        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
                            {products.map((product, index) => (
                                <article
                                    key={product.id}
                                    className="product-card-animated"
                                    style={{
                                        background: brandTheme.creamSoft,
                                        border: `1px solid ${brandTheme.border}`,
                                        borderRadius: 16,
                                        overflow: 'hidden',
                                        boxShadow: '0 14px 24px rgba(12, 40, 62, 0.08)',
                                        animationDelay: `${index * 0.08}s`,
                                    }}
                                >
                                    <div style={{ padding: 14 }}>
                                        <div
                                            className="product-image-wrap-animated"
                                            style={{
                                                height: 168,
                                                borderRadius: 14,
                                                background: `linear-gradient(135deg, ${brandTheme.cream} 0%, #e6dbc7 100%)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: 14,
                                                marginBottom: 14,
                                            }}
                                        >
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="product-image-animated"
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        mixBlendMode: 'multiply',
                                                    }}
                                                />
                                            ) : null}
                                        </div>
                                        <span className="product-badge-animated" style={{ display: 'inline-block', background: brandTheme.navyDeep, color: brandTheme.creamSoft, borderRadius: 999, padding: '5px 10px', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                                            {product.category}
                                        </span>
                                        <strong style={{ display: 'block', fontSize: 17, color: brandTheme.navy, marginBottom: 6 }}>{product.name}</strong>
                                        <p style={{ marginTop: 0, color: brandTheme.muted }}>{product.category}</p>
                                        <p className="product-price-animated" style={{ margin: '8px 0 12px', fontWeight: 700, fontSize: 20, color: brandTheme.navyDeep }}>${product.price}.00</p>
                                        <button type="button" className="add-cart-btn-animated" style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: 'none', background: brandTheme.orange, color: '#fff', cursor: 'default', fontWeight: 700 }}>
                                            Agregar al carrito
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </section>
                    ) : (
                        <section className="info-panel-animated" style={pageCardStyle}>
                            <strong style={{ display: 'block', color: brandTheme.navy, fontSize: 22, marginBottom: 10 }}>Todavía no hay productos cargados en esta categoría</strong>
                            <p style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                                La vista individual ya quedó lista. Solo falta completar el catálogo específico de esta categoría.
                            </p>
                        </section>
                    )
                ) : (
                    <section className="info-panel-animated" style={pageCardStyle}>
                        <strong style={{ display: 'block', color: brandTheme.navy, fontSize: 22, marginBottom: 10 }}>Regístrate para ver el catálogo de {title}</strong>
                        <p style={{ margin: '0 0 16px', color: brandTheme.muted, lineHeight: 1.7 }}>{registerMessage}</p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <a href="/registrar" className="cta-link-animated" style={{ textDecoration: 'none', background: brandTheme.orange, color: '#fff', borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>
                                Registrarme
                            </a>
                            <a href="/login" className="cta-link-outline-animated" style={{ textDecoration: 'none', border: `1px solid ${brandTheme.border}`, color: brandTheme.navy, borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>
                                Iniciar sesión
                            </a>
                        </div>
                    </section>
                )}
            </main>
        </PageLayout>
    );
}