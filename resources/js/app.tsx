import React from 'react';
import { createRoot } from 'react-dom/client';
import HomeHeroBanner from './components/HomeHeroBanner';
import Home from './Home';
import CategoriesView from './pages/CategoriesView';
import AvesCategoryView from './pages/AvesCategoryView';
import GatosCategoryView from './pages/GatosCategoryView';
import PecesCategoryView from './pages/PecesCategoryView';
import PerrosCategoryView from './pages/PerrosCategoryView';
import ReptilesCategoryView from './pages/ReptilesCategoryView';
import RoedoresCategoryView from './pages/RoedoresCategoryView';
import LoginView from './pages/LoginView';
import RegisterView from './pages/RegisterView';
import ProductsView from './pages/ProductsView';
import SearchResultsView from './pages/SearchResultsView';
import SitemapView from './pages/SitemapView';
import ErrorView from './pages/ErrorView';
import PageLayout from './components/PageLayout';
import { brandTheme } from './theme';

type AuthStatus = {
    authenticated: boolean;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
};

function SectionView({ title, description }: { title: string; description: string }) {
    return (
        <PageLayout>
            <main style={{ maxWidth: 920, margin: '40px auto', padding: '0 16px' }}>
                <section style={{ background: brandTheme.creamSoft, border: `1px solid ${brandTheme.border}`, borderRadius: 20, padding: 24, boxShadow: '0 12px 22px rgba(12, 40, 62, 0.08)' }}>
                    <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Vista separada</span>
                    <h1 style={{ margin: '8px 0 10px', color: brandTheme.navy, fontSize: 'clamp(24px, 4vw, 34px)' }}>{title}</h1>
                    <p style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.7 }}>{description}</p>

                    <div style={{ marginTop: 18 }}>
                        <a href="/" style={{ textDecoration: 'none', background: brandTheme.orange, color: '#fff', borderRadius: 12, padding: '10px 14px', fontWeight: 700 }}>
                            Volver al Home
                        </a>
                    </div>
                </section>
            </main>
        </PageLayout>
    );
}

function AccessRequiredView() {
    React.useLayoutEffect(() => {
        window.sessionStorage.setItem('auth_notice', 'Regístrate o inicia sesión para continuar.');
        window.location.replace('/registrar');
    }, []);

    return null;
}

function AppRouter() {
    const [authState, setAuthState] = React.useState<AuthStatus>({ authenticated: false, user: null });
    const [authLoading, setAuthLoading] = React.useState(true);
    const path = window.location.pathname.toLowerCase();

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
                    throw new Error('No se pudo consultar la sesión actual.');
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
            } finally {
                if (active) {
                    setAuthLoading(false);
                }
            }
        }

        loadAuthStatus();

        return () => {
            active = false;
        };
    }, []);

    function renderProtectedView(view: React.ReactNode) {
        if (authLoading) {
            return <SectionView title="Cargando" description="Estamos verificando tu sesión para mostrar esta sección." />;
        }

        if (!authState.authenticated) {
            return <AccessRequiredView />;
        }

        return view;
    }

    switch (path) {
        case '/':
            return <Home isAuthenticated={authState.authenticated} />;
        case '/categorias':
            return <CategoriesView />;
        case '/categorias/aves':
            return renderProtectedView(<AvesCategoryView isAuthenticated={authState.authenticated} />);
        case '/categorias/gatos':
            return renderProtectedView(<GatosCategoryView isAuthenticated={authState.authenticated} />);
        case '/categorias/peces':
            return renderProtectedView(<PecesCategoryView isAuthenticated={authState.authenticated} />);
        case '/categorias/perros':
            return renderProtectedView(<PerrosCategoryView isAuthenticated={authState.authenticated} />);
        case '/categorias/reptiles':
            return renderProtectedView(<ReptilesCategoryView isAuthenticated={authState.authenticated} />);
        case '/categorias/roedores':
            return renderProtectedView(<RoedoresCategoryView isAuthenticated={authState.authenticated} />);
        case '/productos':
            return renderProtectedView(<ProductsView />);
        case '/promociones':
            return (
                <PageLayout>
                    <HomeHeroBanner />
                </PageLayout>
            );
        case '/mas-vendidos':
            return <SectionView title="Mas vendidos" description="Vista separada para mostrar productos con mayor demanda." />;
        case '/contacto':
            return <SectionView title="Contacto" description="Vista dedicada para soporte, correo y medios de contacto." />;
        case '/ayuda':
            return <SectionView title="Ayuda" description="Vista separada con preguntas frecuentes, chat y recuperación." />;
        case '/registrar':
            return <RegisterView />;
        case '/buzon':
            return renderProtectedView(<SectionView title="Buzon" description="Vista separada para mensajes y notificaciones del usuario." />);
        case '/login':
            return <LoginView />;
        case '/recuperacion':
            return <SectionView title="Recuperacion de contraseña" description="Vista separada para recuperar acceso a la cuenta." />;
        case '/chat':
            return renderProtectedView(<SectionView title="Chat" description="Vista dedicada para atención y soporte en tiempo real." />);
        case '/carrito':
            return <SectionView title="Carrito" description="Vista estática del carrito. Solo muestra la ubicación del elemento en la navegación, sin operaciones ni backend." />;
        case '/busqueda':
            return <SearchResultsView canSearchProducts={authState.authenticated} authLoading={authLoading} />;
        case '/mapa-del-sitio':
            return <SitemapView />;
        default:
            return <ErrorView />;
    }
}

const rootElement = document.getElementById('app');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <AppRouter />
        </React.StrictMode>,
    );
}
