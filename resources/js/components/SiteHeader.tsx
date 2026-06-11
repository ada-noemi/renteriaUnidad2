import React from 'react';
import { brandTheme } from '../theme';

export type NavLink = {
    label: string;
    href: string;
};

export const mainNavLinks: NavLink[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Categorias', href: '/categorias' },
    { label: 'Productos', href: '/productos' },
    { label: 'Perro', href: '/categorias/perros' },
    { label: 'Gato', href: '/categorias/gatos' },
    { label: 'Peces', href: '/categorias/peces' },
    { label: 'Aves', href: '/categorias/aves' },
    { label: 'Pequenas Especies', href: '/categorias/roedores' },
];

export default function SiteHeader() {
    const [searchTerm, setSearchTerm] = React.useState('');

    const actionButtonStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 42,
        height: 42,
        borderRadius: 999,
        border: `1px solid rgba(239, 232, 216, 0.28)`,
        background: 'rgba(239, 232, 216, 0.12)',
        color: brandTheme.creamSoft,
        textDecoration: 'none',
        flexShrink: 0,
    };

    function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const query = searchTerm.trim();

        if (!query) {
            return;
        }

        window.location.href = `/busqueda?q=${encodeURIComponent(query)}`;
    }

    return (
        <>
            <div style={{ height: 8, background: brandTheme.navy }} />

            <header style={{ background: brandTheme.navy, color: brandTheme.creamSoft, borderBottom: `1px solid rgba(239, 232, 216, 0.2)`, boxShadow: '0 8px 24px rgba(12, 40, 62, 0.12)' }}>
                <div style={{ maxWidth: 1180, margin: '0 auto', padding: '16px 16px 14px', display: 'grid', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
                        <a href="/" aria-label="PetWord inicio" style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, color: 'inherit', textDecoration: 'none' }}>
                            <img
                                src="/images/pertword.png"
                                alt="PetWord"
                                style={{
                                    width: 92,
                                    height: 92,
                                    objectFit: 'contain',
                                    display: 'block',
                                    flexShrink: 0,
                                    filter: 'drop-shadow(0 6px 12px rgba(12, 40, 62, 0.15))',
                                }}
                            />
                            <div style={{ lineHeight: 1 }}>
                                <strong style={{ display: 'block', fontSize: 'clamp(26px, 3.5vw, 34px)', lineHeight: 1, letterSpacing: '0.2px' }}>
                                    <span style={{ color: brandTheme.creamSoft }}>Pet</span>
                                    <span style={{ color: brandTheme.orange }}>Word</span>
                                </strong>
                            </div>
                        </a>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', background: 'rgba(239, 232, 216, 0.12)', borderRadius: 999, padding: '10px 14px', width: 'min(100%, 320px)', flex: '1 1 240px', border: `1px solid rgba(239, 232, 216, 0.28)` }}>
                                <span style={{ color: brandTheme.creamSoft, marginRight: 8 }}>Busqueda</span>
                                <input
                                    type="search"
                                    placeholder="Buscar productos o categorias"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    style={{ border: 'none', outline: 'none', width: '100%', color: brandTheme.creamSoft, fontSize: 14, background: 'transparent' }}
                                />
                            </form>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', color: brandTheme.creamSoft, fontWeight: 700 }}>
                                <a href="/registrar" style={actionButtonStyle} aria-label="Registrar" title="Registrar">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M15 20a4 4 0 0 0-8 0" />
                                        <circle cx="11" cy="8" r="4" />
                                        <path d="M20 8v6" />
                                        <path d="M17 11h6" />
                                    </svg>
                                </a>
                                <a href="/login" style={actionButtonStyle} aria-label="Inicio de sesion" title="Inicio de sesion">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <path d="M10 17l5-5-5-5" />
                                        <path d="M15 12H3" />
                                    </svg>
                                </a>
                                <a href="/buzon" style={actionButtonStyle} aria-label="Buzon" title="Buzon">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M4 4h16v16H4z" />
                                        <path d="m22 6-10 7L2 6" />
                                    </svg>
                                </a>
                                <a href="/chat" style={actionButtonStyle} aria-label="Chat" title="Chat">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                                        <path d="M8 9h8" />
                                        <path d="M8 13h5" />
                                    </svg>
                                </a>
                                <a href="/recuperacion" style={actionButtonStyle} aria-label="Recuperar contraseña" title="Recuperar contraseña">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="7.5" cy="14.5" r="3.5" />
                                        <path d="M10 12 21 1" />
                                        <path d="m15 6 3 3" />
                                        <path d="m18 3 3 3" />
                                    </svg>
                                </a>
                                <a href="/carrito" style={{ position: 'relative', ...actionButtonStyle }} aria-label="Carrito" title="Carrito estatico">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="9" cy="20" r="1" />
                                        <circle cx="18" cy="20" r="1" />
                                        <path d="M1 1h4l2.6 13.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L23 6H6" />
                                    </svg>
                                    <span style={{ position: 'absolute', top: -5, right: -5, minWidth: 18, height: 18, padding: '0 4px', borderRadius: 999, background: brandTheme.orange, color: '#fff', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${brandTheme.navy}` }}>0</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: `1px solid rgba(239, 232, 216, 0.18)`, paddingTop: 12, display: 'grid', gap: 10 }}>
                        <nav
                            aria-label="Menu de navegacion web"
                            style={{
                                display: 'flex',
                                gap: 10,
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                padding: 0,
                                position: 'relative',
                            }}
                        >
                            {mainNavLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    style={{
                                        color: brandTheme.creamSoft,
                                        textDecoration: 'none',
                                        padding: '9px 12px',
                                        borderRadius: 999,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <span>{link.label}</span>
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
}
