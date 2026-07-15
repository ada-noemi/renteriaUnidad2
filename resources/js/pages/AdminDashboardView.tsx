import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';
import { products } from '../siteData';

type AdminUser = {
    id: number;
    name: string;
    email: string;
    user_type: 'cliente' | 'admin';
    active: boolean;
    created_at: string | null;
};

type DashboardData = {
    current_user?: {
        id: number;
        name: string;
        email: string;
        user_type: 'cliente' | 'admin';
    } | null;
    stats: {
        total_users: number;
        admins: number;
        clients: number;
        active_sessions: number;
    };
    users: AdminUser[];
};

const cardStyle: React.CSSProperties = {
    background: brandTheme.creamSoft,
    border: `1px solid ${brandTheme.border}`,
    borderRadius: 16,
    boxShadow: '0 16px 30px rgba(12, 40, 62, 0.1)',
};

const adminStyles = `
@keyframes adminFadeUp {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.admin-panel-animated {
    animation: adminFadeUp 0.45s ease-out both;
}
`;

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <article className="admin-panel-animated" style={{ ...cardStyle, padding: 20 }}>
            <span style={{ display: 'block', color: brandTheme.muted, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>{label}</span>
            <strong style={{ display: 'block', marginTop: 8, color: brandTheme.navy, fontSize: 32, lineHeight: 1 }}>{value}</strong>
        </article>
    );
}

export default function AdminDashboardView() {
    const [dashboard, setDashboard] = React.useState<DashboardData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        let active = true;

        async function loadDashboard() {
            try {
                const response = await fetch('/admin/dashboard', {
                    credentials: 'same-origin',
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (!response.ok) {
                    throw new Error('No se pudo cargar el panel administrativo.');
                }

                const data = (await response.json()) as DashboardData;

                if (active) {
                    setDashboard(data);
                }
            } catch (requestError) {
                if (active) {
                    setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el panel administrativo.');
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadDashboard();

        return () => {
            active = false;
        };
    }, []);

    const productCount = products.length;

    return (
        <PageLayout>
            <style>{adminStyles}</style>

            <main style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 16px 56px' }}>
                <section className="admin-panel-animated" style={{ marginBottom: 24 }}>
                    <span style={{ color: brandTheme.orange, fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>Administración</span>
                    <h1 style={{ margin: '8px 0 10px', color: brandTheme.navy, fontSize: 'clamp(28px, 5vw, 42px)' }}>Panel de PetWord</h1>
                    <p style={{ margin: 0, maxWidth: 760, color: brandTheme.muted, lineHeight: 1.7 }}>
                        Vista interna para revisar usuarios registrados, tipos de cuenta y sesiones activas.
                    </p>
                </section>

                {loading ? (
                    <section style={{ ...cardStyle, padding: 24, color: brandTheme.muted }}>Cargando panel...</section>
                ) : null}

                {error ? (
                    <section style={{ ...cardStyle, padding: 24, color: '#a73333', borderColor: '#e3b1b1', background: '#fff0f0' }}>{error}</section>
                ) : null}

                {dashboard ? (
                    <div style={{ display: 'grid', gap: 22 }}>
                        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                            <StatCard label="Usuarios" value={dashboard.stats.total_users} />
                            <StatCard label="Clientes" value={dashboard.stats.clients} />
                            <StatCard label="Administradores" value={dashboard.stats.admins} />
                            <StatCard label="Sesiones activas" value={dashboard.stats.active_sessions} />
                            <StatCard label="Productos" value={productCount} />
                        </section>

                        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(280px, 0.7fr)', gap: 18, alignItems: 'start' }}>
                            <article className="admin-panel-animated" style={{ ...cardStyle, overflow: 'hidden' }}>
                                <div style={{ padding: 20, borderBottom: `1px solid ${brandTheme.border}` }}>
                                    <h2 style={{ margin: 0, color: brandTheme.navy, fontSize: 22 }}>Usuarios registrados</h2>
                                    <p style={{ margin: '6px 0 0', color: brandTheme.muted }}>Listado simple para distinguir clientes y administradores.</p>
                                </div>

                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                                        <thead>
                                            <tr style={{ background: '#fffaf1', color: brandTheme.navyDeep, textAlign: 'left' }}>
                                                <th style={{ padding: '12px 16px' }}>Nombre</th>
                                                <th style={{ padding: '12px 16px' }}>Correo</th>
                                                <th style={{ padding: '12px 16px' }}>Tipo</th>
                                                <th style={{ padding: '12px 16px' }}>Estado</th>
                                                <th style={{ padding: '12px 16px' }}>Registro</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dashboard.users.map((user) => (
                                                <tr key={user.id} style={{ borderTop: `1px solid ${brandTheme.border}` }}>
                                                    <td style={{ padding: '12px 16px', color: brandTheme.text, fontWeight: 700 }}>{user.name}</td>
                                                    <td style={{ padding: '12px 16px', color: brandTheme.muted }}>{user.email}</td>
                                                    <td style={{ padding: '12px 16px' }}>
                                                        <span style={{ display: 'inline-flex', borderRadius: 999, padding: '5px 10px', color: '#fff', background: user.user_type === 'admin' ? brandTheme.navy : brandTheme.orange, fontSize: 12, fontWeight: 700 }}>
                                                            {user.user_type === 'admin' ? 'Admin' : 'Cliente'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '12px 16px', color: user.active ? '#1f6b34' : brandTheme.muted, fontWeight: 700 }}>
                                                        {user.active ? 'Activo' : 'Sin sesión'}
                                                    </td>
                                                    <td style={{ padding: '12px 16px', color: brandTheme.muted }}>{user.created_at ?? 'Sin fecha'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </article>

                            <aside style={{ display: 'grid', gap: 18 }}>
                                <article className="admin-panel-animated" style={{ ...cardStyle, padding: 20 }}>
                                    <h2 style={{ margin: 0, color: brandTheme.navy, fontSize: 22 }}>Sesión actual</h2>
                                    <p style={{ margin: '8px 0 0', color: brandTheme.muted, lineHeight: 1.6 }}>
                                        {dashboard.current_user?.name ?? 'Administrador'} está conectado como administrador.
                                    </p>
                                    <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
                                        <div style={{ border: `1px solid ${brandTheme.border}`, borderRadius: 12, padding: 12, background: '#fffaf1' }}>
                                            <strong style={{ display: 'block', color: brandTheme.navy }}>Correo</strong>
                                            <span style={{ color: brandTheme.muted }}>{dashboard.current_user?.email ?? 'Sin correo'}</span>
                                        </div>
                                        <div style={{ border: `1px solid ${brandTheme.border}`, borderRadius: 12, padding: 12, background: '#fffaf1' }}>
                                            <strong style={{ display: 'block', color: brandTheme.navy }}>Sesiones activas</strong>
                                            <span style={{ color: brandTheme.muted }}>{dashboard.stats.active_sessions} sesión(es) detectada(s)</span>
                                        </div>
                                    </div>
                                </article>

                                <article className="admin-panel-animated" style={{ ...cardStyle, padding: 20 }}>
                                    <h2 style={{ margin: 0, color: brandTheme.navy, fontSize: 22 }}>Accesos rápidos</h2>
                                    <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
                                        <a href="/productos" style={{ textDecoration: 'none', border: `1px solid ${brandTheme.border}`, borderRadius: 12, padding: 12, background: '#fffaf1', color: brandTheme.navy, fontWeight: 700 }}>
                                            Ver catálogo
                                        </a>
                                        <a href="/categorias" style={{ textDecoration: 'none', border: `1px solid ${brandTheme.border}`, borderRadius: 12, padding: 12, background: '#fffaf1', color: brandTheme.navy, fontWeight: 700 }}>
                                            Ver categorías
                                        </a>
                                    </div>
                                </article>
                            </aside>
                        </section>
                    </div>
                ) : null}
            </main>
        </PageLayout>
    );
}
