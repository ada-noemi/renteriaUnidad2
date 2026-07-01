import React from 'react';
import { brandTheme } from '../theme';

type FooterLink = {
    label: string;
    href: string;
};

const primaryLinks: FooterLink[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Categorías', href: '/categorias' },
    { label: 'Productos', href: '/productos' },
];

const supportLinks: FooterLink[] = [
    { label: 'Ayuda', href: '/ayuda' },
    { label: 'Contáctanos', href: '/contacto' },
    { label: 'Recuperación de contraseña', href: '/recuperacion' },
    { label: 'Chat', href: '/chat' },
    { label: 'Mapa del sitio', href: '/mapa-del-sitio' },
];

// Animaciones: columnas cayendo desde arriba en cascada al montarse,
// links con subrayado animado + color naranja al hacer hover
const animationStyles = `
@keyframes footerColumnFallDown {
    0% {
        opacity: 0;
        transform: translateY(-40px);
    }
    70% {
        opacity: 1;
        transform: translateY(4px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.footer-column-animated {
    animation: footerColumnFallDown 0.55s cubic-bezier(0.34, 1.4, 0.64, 1) both;
}

.footer-link-animated {
    position: relative;
    transition: color 0.2s ease;
}
.footer-link-animated::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 1px;
    background: currentColor;
    transition: width 0.25s ease;
}
.footer-link-animated:hover {
    color: ${brandTheme.orange};
}
.footer-link-animated:hover::after {
    width: 100%;
}
`;

type SiteFooterProps = {
    categories: { id: number; name: string; slug?: string }[];
};

export default function SiteFooter({ categories }: SiteFooterProps) {
    const linkStyle: React.CSSProperties = {
        color: brandTheme.cream,
        textDecoration: 'none',
    };

    return (
        <footer style={{ background: brandTheme.navyDeep, color: brandTheme.cream }}>
            <style>{animationStyles}</style>

            <div style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
                <section className="footer-column-animated" style={{ animationDelay: '0s' }}>
                    <h3 style={{ marginTop: 0, color: brandTheme.creamSoft }}>Secciónes principales</h3>
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                        {primaryLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className="footer-link-animated" style={linkStyle}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="footer-column-animated" style={{ animationDelay: '0.08s' }}>
                    <h3 style={{ marginTop: 0, color: brandTheme.creamSoft }}>Categorías</h3>
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <a href={category.slug ? `/categorias/${category.slug === 'roedores' ? 'roedores' : category.slug}` : '/categorias'} className="footer-link-animated" style={linkStyle}>
                                    {category.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="footer-column-animated" style={{ animationDelay: '0.16s' }}>
                    <h3 style={{ marginTop: 0, color: brandTheme.creamSoft }}>Soporte y cuenta</h3>
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                        {supportLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} className="footer-link-animated" style={linkStyle}>{link.label}</a>
                            </li>
                        ))}
                        <li>
                            <a href="/adopciones" className="footer-link-animated" style={linkStyle}>Pagina 404</a>
                        </li>
                    </ul>
                    <p style={{ margin: '12px 0 0', color: brandTheme.cream }}>Correo: contacto@petword.test</p>
                </section>
            </div>
        </footer>
    );
}