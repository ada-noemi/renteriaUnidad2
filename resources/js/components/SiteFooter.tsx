import React from 'react';
import { brandTheme } from '../theme';

type FooterLink = {
    label: string;
    href: string;
};

const primaryLinks: FooterLink[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Categorias', href: '/categorias' },
    { label: 'Productos', href: '/productos' },
];

const supportLinks: FooterLink[] = [
    { label: 'Ayuda', href: '/ayuda' },
    { label: 'Contactanos', href: '/contacto' },
    { label: 'Recuperacion de contraseña', href: '/recuperacion' },
    { label: 'Chat', href: '/chat' },
    { label: 'Mapa del sitio', href: '/mapa-del-sitio' },
];

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
            <div style={{ maxWidth: 1180, margin: '0 auto', padding: '28px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
                <section>
                    <h3 style={{ marginTop: 0, color: brandTheme.creamSoft }}>Secciones principales</h3>
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                        {primaryLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} style={linkStyle}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h3 style={{ marginTop: 0, color: brandTheme.creamSoft }}>Categorias</h3>
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <a href={category.slug ? `/categorias/${category.slug === 'roedores' ? 'roedores' : category.slug}` : '/categorias'} style={linkStyle}>
                                    {category.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h3 style={{ marginTop: 0, color: brandTheme.creamSoft }}>Soporte y cuenta</h3>
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
                        {supportLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href} style={linkStyle}>{link.label}</a>
                            </li>
                        ))}
                        <li>
                            <a href="/adopciones" style={linkStyle}>Pagina 404</a>
                        </li>
                    </ul>
                    <p style={{ margin: '12px 0 0', color: brandTheme.cream }}>Correo: contacto@petword.test</p>
                </section>
            </div>
        </footer>
    );
}
