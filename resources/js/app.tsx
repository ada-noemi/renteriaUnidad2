import React from 'react';
import { createRoot } from 'react-dom/client';
import HomeHeroBanner from './components/HomeHeroBanner';
import Home from './Home';
import LoginView from './pages/LoginView';
import RegisterView from './pages/RegisterView';
import ProductsView from './pages/ProductsView';
import SearchResultsView from './pages/SearchResultsView';
import SitemapView from './pages/SitemapView';
import ErrorView from './pages/ErrorView';
import PageLayout from './components/PageLayout';
import { brandTheme } from './theme';

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

function AppRouter() {
    const path = window.location.pathname.toLowerCase();

    switch (path) {
        case '/':
            return <Home />;
        case '/categorias':
            return <SectionView title="Categorias" description="Vista dedicada para navegar categorías de mascotas y sus secciones." />;
        case '/productos':
            return <ProductsView />;
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
            return <SectionView title="Buzon" description="Vista separada para mensajes y notificaciones del usuario." />;
        case '/login':
            return <LoginView />;
        case '/recuperacion':
            return <SectionView title="Recuperacion de contraseña" description="Vista separada para recuperar acceso a la cuenta." />;
        case '/chat':
            return <SectionView title="Chat" description="Vista dedicada para atención y soporte en tiempo real." />;
        case '/carrito':
            return <SectionView title="Carrito" description="Vista estática del carrito. Solo muestra la ubicación del elemento en la navegación, sin operaciones ni backend." />;
        case '/busqueda':
            return <SearchResultsView />;
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
