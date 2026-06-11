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
            <main style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 16px 52px' }}>
                {isAuthenticated ? (
                    products.length > 0 ? (
                        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
                            {products.map((product) => (
                                <article key={product.id} style={{ background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 14px 24px rgba(12, 40, 62, 0.08)' }}>
                                    <div style={{ padding: 14 }}>
                                        <div
                                            style={{
                                                height: 168,
                                                borderRadius: 14,
                                                background: `linear-gradient(135deg, ${brandTheme.cream} 0%, #e6dbc7 100%)`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: 14,
                                                marginBottom: 14,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {product.image ? (
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        mixBlendMode: 'multiply',
                                                    }}
                                                />
                                            ) : null}
                                        </div>
                                        <span style={{ display: 'inline-block', background: brandTheme.navyDeep, color: brandTheme.creamSoft, borderRadius: 999, padding: '5px 10px', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
                                            {product.category}
                                        </span>
                                        <strong style={{ display: 'block', fontSize: 17, color: brandTheme.navy, marginBottom: 6 }}>{product.name}</strong>
                                        <p style={{ marginTop: 0, color: brandTheme.muted }}>{product.category}</p>
                                        <p style={{ margin: '8px 0 12px', fontWeight: 700, fontSize: 20, color: brandTheme.navyDeep }}>${product.price}.00</p>
                                        <button type="button" style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: 'none', background: brandTheme.orange, color: '#fff', cursor: 'default', fontWeight: 700 }}>
                                            Agregar al carrito
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </section>
                    ) : (
                        <section style={pageCardStyle}>
                            <strong style={{ display: 'block', color: brandTheme.navy, fontSize: 22, marginBottom: 10 }}>Todavía no hay productos cargados en esta categoría</strong>
                            <p style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>
                                La vista individual ya quedó lista. Solo falta completar el catálogo específico de esta categoría.
                            </p>
                        </section>
                    )
                ) : (
                    <section style={pageCardStyle}>
                        <strong style={{ display: 'block', color: brandTheme.navy, fontSize: 22, marginBottom: 10 }}>Regístrate para ver el catálogo de {title}</strong>
                        <p style={{ margin: '0 0 16px', color: brandTheme.muted, lineHeight: 1.7 }}>{registerMessage}</p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <a href="/registrar" style={{ textDecoration: 'none', background: brandTheme.orange, color: '#fff', borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>
                                Registrarme
                            </a>
                            <a href="/login" style={{ textDecoration: 'none', border: `1px solid ${brandTheme.border}`, color: brandTheme.navy, borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>
                                Iniciar sesión
                            </a>
                        </div>
                    </section>
                )}
            </main>
        </PageLayout>
    );
}