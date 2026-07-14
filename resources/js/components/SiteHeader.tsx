import React from 'react';
import { brandTheme } from '../theme';

export type NavLink = {
    label: string;
    href: string;
};

export const mainNavLinks: NavLink[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Categorías', href: '/categorias' },
    { label: 'Perro', href: '/categorias/perros' },
    { label: 'Gato', href: '/categorias/gatos' },
    { label: 'Peces', href: '/categorias/peces' },
    { label: 'Aves', href: '/categorias/aves' },
    { label: 'Pequeñas especies', href: '/categorias/roedores' },
    { label: 'Adopciones', href: '/adopciones' },
];

type AuthStatus = {
    authenticated: boolean;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
};

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
}

// Animaciones: entrada del header, hover en links/botones/logo, foco en la búsqueda
const animationStyles = `
@keyframes headerFadeDown {
    from {
        opacity: 0;
        transform: translateY(-12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.site-header-animated {
    animation: headerFadeDown 0.6s ease-out;
}

.logo-link-animated {
    transition: transform 0.25s ease;
}
.logo-link-animated:hover {
    transform: scale(1.04);
}

.nav-link-animated {
    transition: background-color 0.25s ease, transform 0.25s ease;
}
.nav-link-animated:hover {
    background-color: rgba(239, 232, 216, 0.14);
    transform: translateY(-2px);
}

.action-btn-animated {
    transition: background-color 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
}
.action-btn-animated:hover {
    background-color: rgba(239, 232, 216, 0.24);
    border-color: rgba(239, 232, 216, 0.5);
    transform: translateY(-2px) scale(1.06);
}

.search-form-animated {
    transition: background-color 0.25s ease, border-color 0.25s ease;
}
.search-form-animated:focus-within {
    background-color: rgba(239, 232, 216, 0.2);
    border-color: rgba(239, 232, 216, 0.5);
}

.auth-session-active a[href="/login"],
.auth-session-active a[href="/registrar"] {
    display: none !important;
}
`;

export default function SiteHeader() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [authState, setAuthState] = React.useState<AuthStatus>({ authenticated: false, user: null });
    const [logoutLoading, setLogoutLoading] = React.useState(false);

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

    React.useEffect(() => {
        let active = true;

        async function loadAuthStatus() {
            try {
                const response = await fetch('/auth/status', {
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('No se pudo consultar la sesión.');
                }

                const data = (await response.json()) as AuthStatus;

                if (active) {
                    setAuthState({
                        authenticated: data.authenticated,
                        user: data.user ?? null,
                    });
                }
            } catch {
                if (active) {
                    setAuthState({ authenticated: false, user: null });
                }
            }
        }

        loadAuthStatus();

        return () => {
            active = false;
        };
    }, []);

    async function handleLogout() {
        if (logoutLoading) {
            return;
        }

        setLogoutLoading(true);

        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
            });

            if (!response.ok) {
                throw new Error('No se pudo cerrar la sesión.');
            }

            window.sessionStorage.setItem('auth_notice', 'Sesión cerrada correctamente.');
            window.location.href = '/login';
        } catch {
            window.alert('No se pudo cerrar la sesión. Intenta de nuevo.');
            setLogoutLoading(false);
        }
    }

    return (
        <>
            <style>{animationStyles}</style>

            <div style={{ height: 8, background: brandTheme.navy }} />

            <header
                className="site-header-animated"
                style={{ background: brandTheme.navy, color: brandTheme.creamSoft, borderBottom: `1px solid rgba(239, 232, 216, 0.2)`, boxShadow: '0 8px 24px rgba(12, 40, 62, 0.12)' }}
            >
                <div style={{ maxWidth: 1180, margin: '0 auto', padding: '16px 16px 14px', display: 'grid', gap: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
                        <a href="/" aria-label="PetWord inicio" className="logo-link-animated" style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, color: 'inherit', textDecoration: 'none' }}>
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
                            <form onSubmit={handleSearchSubmit} className="search-form-animated" style={{ display: 'flex', alignItems: 'center', background: 'rgba(239, 232, 216, 0.12)', borderRadius: 999, padding: '10px 14px', width: 'min(100%, 320px)', flex: '1 1 240px', border: `1px solid rgba(239, 232, 216, 0.28)` }}>
                                <span style={{ color: brandTheme.creamSoft, marginRight: 8 }}>Búsqueda</span>
                                <input
                                    type="search"
                                    placeholder="Buscar productos o categorías"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    style={{ border: 'none', outline: 'none', width: '100%', color: brandTheme.creamSoft, fontSize: 14, background: 'transparent' }}
                                />
                            </form>

                            <div className={authState.authenticated ? 'auth-session-active' : undefined} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', color: brandTheme.creamSoft, fontWeight: 700 }}>
                                {authState.authenticated ? (
                                    <button
                                        type="button"
                                        className="action-btn-animated"
                                        onClick={handleLogout}
                                        disabled={logoutLoading}
                                        style={{ ...actionButtonStyle, cursor: logoutLoading ? 'wait' : 'pointer', opacity: logoutLoading ? 0.72 : 1 }}
                                        aria-label="Cerrar sesión"
                                        title={authState.user?.name ? `Cerrar sesión de ${authState.user.name}` : 'Cerrar sesión'}
                                    >
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <path d="M16 17l5-5-5-5" />
                                            <path d="M21 12H9" />
                                        </svg>
                                    </button>
                                ) : null}
                                <a href="/registrar" className="action-btn-animated" style={{ ...actionButtonStyle, display: authState.authenticated ? 'none' : 'inline-flex' }} aria-label="Registrar" title="Registrar">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M15 20a4 4 0 0 0-8 0" />
                                        <circle cx="11" cy="8" r="4" />
                                        <path d="M20 8v6" />
                                        <path d="M17 11h6" />
                                    </svg>
                                </a>
                                <a href="/login" className="action-btn-animated" style={actionButtonStyle} aria-label="Inicio de sesión" title="Inicio de sesión">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <path d="M10 17l5-5-5-5" />
                                        <path d="M15 12H3" />
                                    </svg>
                                </a>
                                <a href="/buzon" className="action-btn-animated" style={actionButtonStyle} aria-label="Buzón" title="Buzón">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M4 4h16v16H4z" />
                                        <path d="m22 6-10 7L2 6" />
                                    </svg>
                                </a>
                                <a href="/chat" className="action-btn-animated" style={actionButtonStyle} aria-label="Chat" title="Chat">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                                        <path d="M8 9h8" />
                                        <path d="M8 13h5" />
                                    </svg>
                                </a>
                                <a href="/recuperacion" className="action-btn-animated" style={actionButtonStyle} aria-label="Recuperar contraseña" title="Recuperar contraseña">
                                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <circle cx="7.5" cy="14.5" r="3.5" />
                                        <path d="M10 12 21 1" />
                                        <path d="m15 6 3 3" />
                                        <path d="m18 3 3 3" />
                                    </svg>
                                </a>
                                <a href="/carrito" className="action-btn-animated" style={{ position: 'relative', ...actionButtonStyle }} aria-label="Carrito" title="Carrito estático">
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
                            aria-label="Menú de navegación web"
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
                                    className="nav-link-animated"
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
