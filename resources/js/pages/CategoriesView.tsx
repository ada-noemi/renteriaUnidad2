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

// Animaciones: título con fade-in, tarjetas con entrada escalonada,
// hover con levante de tarjeta + zoom de imagen + botón "Ver productos" que se ilumina
const animationStyles = `
@keyframes titleFadeIn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes categoryCardFallDown {
    0% {
        opacity: 0;
        transform: translateY(-120px);
    }
    70% {
        opacity: 1;
        transform: translateY(8px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.categories-title-animated {
    animation: titleFadeIn 0.5s ease-out both;
}

.category-card-animated {
    animation: categoryCardFallDown 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) both;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.category-card-animated:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 30px rgba(12, 40, 62, 0.16);
}

.category-card-animated:hover .category-card-image {
    transform: scale(1.08);
}

.category-card-image {
    transition: transform 0.35s ease;
}

.category-card-cta {
    transition: filter 0.25s ease, transform 0.2s ease;
}
.category-card-animated:hover .category-card-cta {
    filter: brightness(1.08);
    transform: translateY(-1px);
}
`;

export default function CategoriesView() {
    return (
        <PageLayout>
            <style>{animationStyles}</style>

            <main style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 16px 52px' }}>
                <section className="categories-title-animated" style={{ marginBottom: 26 }}>
                    <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Categorías</span>
                    <h1 style={{ margin: '8px 0 12px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 40px)' }}>Indice de categorías</h1>
                </section>

                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 18 }}>
                    {categories.map((category, index) => (
                        <a
                            key={category.id}
                            href={categoryLinks[category.slug]}
                            className="category-card-animated"
                            style={{
                                ...cardStyle,
                                textDecoration: 'none',
                                color: brandTheme.text,
                                display: 'grid',
                                gap: 12,
                                animationDelay: `${index * 0.07}s`,
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
                                    className="category-card-image"
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
                                className="category-card-cta"
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