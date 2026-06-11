import React from 'react';
import HomeHeroBanner from './components/HomeHeroBanner';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import { brandTheme } from './theme';
import { categories, products } from './siteData';

const helpLinks = [
    'Ayuda',
    'Contactanos',
    'Recuperacion de contraseña',
    'Chat',
];

const homeProductTypes = ['peces', 'perro', 'gato', 'pequenas-especies', 'aves', 'reptiles'] as const;

export default function Home({ isAuthenticated }: { isAuthenticated: boolean }) {
    const featuredProducts = homeProductTypes.flatMap((petType) => products.filter((product) => product.petType === petType).slice(0, 2));

    return (
        <div id="inicio" style={{ fontFamily: 'Segoe UI, sans-serif', background: brandTheme.bg, minHeight: '100vh', color: brandTheme.text }}>
            <SiteHeader />

            <HomeHeroBanner />

            <main style={{ maxWidth: 1180, margin: '0 auto', padding: '18px 16px 36px' }}>
                <section id="categorias" style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>
                        <div>
                            <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Categorias</span>
                            <h2 style={{ color: brandTheme.navy, margin: '4px 0 0', fontSize: 'clamp(24px, 4vw, 32px)' }}>Explora por tipo de mascota</h2>
                            <p style={{ margin: '8px 0 0', color: brandTheme.muted, maxWidth: 620, lineHeight: 1.7 }}>
                                Un acceso visual a las categorias principales.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 18 }}>
                        {categories.map((category) => (
                            <a
                                key={category.id}
                                href={`/categorias#${category.slug}`}
                                style={{
                                    textDecoration: 'none',
                                    color: brandTheme.text,
                                    textAlign: 'center',
                                    fontWeight: 700,
                                    padding: '12px 10px 8px',
                                }}
                            >
                                <div
                                    style={{
                                        position: 'relative',
                                        height: 170,
                                        marginBottom: 10,
                                        display: 'grid',
                                        placeItems: 'center',
                                    }}
                                >
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            maxWidth: 160,
                                            maxHeight: 160,
                                            objectFit: 'contain',
                                            position: 'relative',
                                            zIndex: 2,
                                        }}
                                    />
                                </div>
                                <span style={{ display: 'block', color: '#df6f14', fontSize: 17 }}>{category.name}</span>
                            </a>
                        ))}
                    </div>
                </section>

                <section id="productos" style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
                        <div>
                            <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Productos</span>
                            <h2 style={{ color: brandTheme.navy, margin: '4px 0 0', fontSize: 'clamp(24px, 4vw, 28px)' }}>Seccion principal del Home</h2>
                        </div>
                        <span style={{ color: brandTheme.muted }}>Se muestran 2 productos por categoria en el inicio.</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
                        {featuredProducts.map((product) => (
                            <article key={product.id} style={{ background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 14px 24px rgba(12, 40, 62, 0.08)' }}>
                                <div style={{ padding: 14 }}>
                                    <div
                                        style={{
                                            height: 184,
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
                                    <strong style={{ display: 'block', fontSize: 18, color: brandTheme.navy, marginBottom: 6 }}>{product.name}</strong>
                                    <p style={{ marginTop: 0, color: brandTheme.muted }}>{product.category}</p>
                                    <p style={{ margin: '8px 0 12px', fontWeight: 700, fontSize: 22, color: brandTheme.navyDeep }}>${product.price}.00</p>
                                    <button type="button" style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: 'none', background: brandTheme.orange, color: '#fff', cursor: 'default', fontWeight: 700 }}>
                                        Agregar al carrito
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <SiteFooter categories={categories} />
        </div>
    );
}
