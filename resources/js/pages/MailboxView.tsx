import React from 'react';
import PageLayout from '../components/PageLayout';
import { brandTheme } from '../theme';

type Tag = 'Compra' | 'Consejo' | 'Ayuda' | 'Soporte';

type Message = {
    id: number;
    title: string;
    text: string;
    time: string;
    tag: Tag;
    read: boolean;
};

const TAG_STYLES: Record<Tag, { bg: string; color: string }> = {
    Compra:  { bg: '#EEF6FF', color: '#1A5FA8' },
    Consejo: { bg: '#F0FDF4', color: '#15803D' },
    Ayuda:   { bg: '#FFF7ED', color: '#C2570A' },
    Soporte: { bg: '#F5F3FF', color: '#6D28D9' },
};

const INITIAL_MESSAGES: Message[] = [
    {
        id: 1,
        title: 'Pedido recibido',
        text: 'Tu solicitud quedó registrada. Te avisaremos cuando el equipo confirme disponibilidad.',
        time: 'Hoy · 10:34',
        tag: 'Compra',
        read: false,
    },
    {
        id: 2,
        title: 'Recordatorio de cuidado',
        text: 'Revisa alimento, agua y limpieza antes de cerrar tu carrito de productos para mascota.',
        time: 'Ayer · 08:15',
        tag: 'Consejo',
        read: false,
    },
    {
        id: 3,
        title: 'Soporte PetWord',
        text: 'Si necesitas ayuda con una categoría o producto, abre el chat y cuéntanos qué buscas.',
        time: 'Esta semana',
        tag: 'Ayuda',
        read: true,
    },
];

const ALL_TAGS: Tag[] = ['Compra', 'Consejo', 'Ayuda', 'Soporte'];

// Duración de la animación de salida al eliminar un mensaje (debe coincidir con el keyframe "card-exit").
const DELETE_ANIMATION_MS = 220;

// Estilos de animación inyectados una sola vez (keyframes globales).
function AnimationStyles() {
    return (
        <style>{`
            @keyframes header-enter {
                from { opacity: 0; transform: translateY(-8px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes chip-enter {
                from { opacity: 0; transform: translateY(6px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes badge-pop {
                0% { opacity: 0; transform: scale(0.5); }
                70% { transform: scale(1.08); }
                100% { opacity: 1; transform: scale(1); }
            }
            @keyframes card-enter {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes card-exit {
                from { opacity: 1; transform: scale(1); max-height: 300px; margin-bottom: 0; }
                to { opacity: 0; transform: scale(0.96); max-height: 0; margin-bottom: -12px; }
            }
            @keyframes text-expand {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes dot-pulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(230, 126, 34, 0.45); }
                50% { box-shadow: 0 0 0 4px rgba(230, 126, 34, 0); }
            }
            @keyframes sidebar-enter {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .mb-header {
                animation: header-enter 0.4s ease both;
            }
            .mb-badge {
                animation: badge-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                display: inline-block;
            }
            .mb-chip {
                animation: chip-enter 0.3s ease both;
            }
            .mb-chip:hover {
                filter: brightness(0.98);
            }
            .mb-card {
                animation: card-enter 0.35s ease both;
                overflow: hidden;
                transition: box-shadow 0.2s ease, transform 0.2s ease;
            }
            .mb-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(12, 40, 62, 0.1);
            }
            .mb-card.exiting {
                animation: card-exit ${DELETE_ANIMATION_MS}ms ease forwards;
                pointer-events: none;
            }
            .mb-text-expanded {
                animation: text-expand 0.25s ease both;
            }
            .mb-unread-dot {
                animation: dot-pulse 1.8s ease-in-out infinite;
                border-radius: 50%;
            }
            .mb-action-btn {
                transition: transform 0.12s ease, background 0.15s ease, filter 0.15s ease;
            }
            .mb-action-btn:hover {
                transform: translateY(-1px);
                filter: brightness(0.97);
            }
            .mb-action-btn:active {
                transform: translateY(0);
            }
            .mb-primary-btn {
                transition: transform 0.15s ease, box-shadow 0.2s ease;
            }
            .mb-primary-btn:hover {
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(230, 126, 34, 0.3);
            }
            .mb-sidebar {
                animation: sidebar-enter 0.4s ease both;
                animation-delay: 0.15s;
            }
            .mb-quicklink {
                transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
            }
            .mb-quicklink:hover {
                transform: translateX(3px);
                border-color: ${brandTheme.orange};
                background: #fff8f0;
            }
            .mb-empty {
                animation: text-expand 0.3s ease both;
            }

            @media (prefers-reduced-motion: reduce) {
                .mb-header, .mb-badge, .mb-chip, .mb-card, .mb-text-expanded,
                .mb-unread-dot, .mb-action-btn, .mb-primary-btn, .mb-sidebar,
                .mb-quicklink, .mb-empty, .mb-card.exiting {
                    animation: none !important;
                    transition: none !important;
                }
            }
        `}</style>
    );
}

export default function MailboxView() {
    const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES);
    const [activeTag, setActiveTag] = React.useState<Tag | null>(null);
    const [expandedId, setExpandedId] = React.useState<number | null>(null);
    const [exitingIds, setExitingIds] = React.useState<Set<number>>(new Set());

    const unreadCount = messages.filter((m) => !m.read).length;

    const filtered = activeTag ? messages.filter((m) => m.tag === activeTag) : messages;

    function markRead(id: number) {
        setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
    }

    function markAllRead() {
        setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
    }

    // Primero reproducimos la animación de salida y, cuando termina, quitamos el mensaje del estado.
    function deleteMessage(id: number) {
        setExitingIds((prev) => new Set(prev).add(id));
        window.setTimeout(() => {
            setMessages((prev) => prev.filter((m) => m.id !== id));
            setExitingIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
            if (expandedId === id) setExpandedId(null);
        }, DELETE_ANIMATION_MS);
    }

    function toggleExpand(id: number) {
        setExpandedId((prev) => (prev === id ? null : id));
        markRead(id);
    }

    return (
        <PageLayout>
            <AnimationStyles />
            <main style={{ maxWidth: 1100, margin: '0 auto', padding: '34px 16px 56px' }}>
                <section style={{ display: 'grid', gap: 22 }}>

                    {/* Header */}
                    <div className="mb-header" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div>
                            <span style={{ color: brandTheme.orange, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                Buzón
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                <h1 style={{ margin: '6px 0 8px', color: brandTheme.navy, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700 }}>
                                    Mensajes de tu cuenta
                                </h1>
                                {unreadCount > 0 && (
                                    <span className="mb-badge" style={{
                                        background: brandTheme.orange, color: '#fff',
                                        borderRadius: 999, fontSize: 12, fontWeight: 700,
                                        padding: '3px 10px', marginBottom: 4,
                                    }}>
                                        {unreadCount} sin leer
                                    </span>
                                )}
                            </div>
                            <p style={{ margin: 0, color: brandTheme.muted, lineHeight: 1.6, maxWidth: 560, fontSize: 14 }}>
                                Avisos importantes, recordatorios y respuestas de soporte.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="mb-action-btn"
                                    style={{
                                        background: 'transparent',
                                        border: `1px solid ${brandTheme.border}`,
                                        borderRadius: 10, padding: '10px 14px',
                                        color: brandTheme.navy, fontWeight: 600,
                                        fontSize: 14, cursor: 'pointer',
                                    }}
                                >
                                    Marcar todo leído
                                </button>
                            )}
                            <a
                                href="/chat"
                                className="mb-primary-btn"
                                style={{
                                    textDecoration: 'none', background: brandTheme.orange,
                                    color: '#fff', borderRadius: 10, padding: '10px 16px',
                                    fontWeight: 700, fontSize: 14, display: 'inline-block',
                                }}
                            >
                                Abrir chat
                            </a>
                        </div>
                    </div>

                    {/* Filter chips */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setActiveTag(null)}
                            className="mb-chip"
                            style={{
                                fontSize: 13, padding: '5px 14px',
                                borderRadius: 999, cursor: 'pointer',
                                border: `1px solid ${activeTag === null ? brandTheme.navy : brandTheme.border}`,
                                background: activeTag === null ? brandTheme.navy : '#fff',
                                color: activeTag === null ? '#fff' : brandTheme.navy,
                                fontWeight: 600,
                                transition: 'all 0.15s',
                            }}
                        >
                            Todos ({messages.length})
                        </button>
                        {ALL_TAGS.filter((t) => messages.some((m) => m.tag === t)).map((tag, chipIndex) => {
                            const s = TAG_STYLES[tag];
                            const active = activeTag === tag;
                            return (
                                <button
                                    key={tag}
                                    onClick={() => setActiveTag(active ? null : tag)}
                                    className="mb-chip"
                                    style={{
                                        fontSize: 13, padding: '5px 14px',
                                        borderRadius: 999, cursor: 'pointer',
                                        border: `1px solid ${active ? s.color : brandTheme.border}`,
                                        background: active ? s.bg : '#fff',
                                        color: active ? s.color : brandTheme.navy,
                                        fontWeight: 600,
                                        transition: 'all 0.15s',
                                        animationDelay: `${0.05 + chipIndex * 0.04}s`,
                                    }}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>

                    {/* Body grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 18, alignItems: 'start' }}>

                        {/* Messages list */}
                        <section style={{ display: 'grid', gap: 12 }}>
                            {filtered.length === 0 && (
                                <p className="mb-empty" style={{ color: brandTheme.muted, fontSize: 14, padding: '24px 0' }}>
                                    No hay mensajes en esta categoría.
                                </p>
                            )}
                            {filtered.map((msg, msgIndex) => {
                                const tag = TAG_STYLES[msg.tag];
                                const expanded = expandedId === msg.id;
                                const exiting = exitingIds.has(msg.id);
                                return (
                                    <article
                                        key={msg.id}
                                        className={`mb-card${exiting ? ' exiting' : ''}`}
                                        style={{
                                            background: msg.read ? '#fff' : brandTheme.creamSoft,
                                            border: `1px solid ${msg.read ? brandTheme.border : brandTheme.navy + '33'}`,
                                            borderRadius: 10,
                                            boxShadow: msg.read ? 'none' : '0 4px 14px rgba(12,40,62,0.08)',
                                            animationDelay: exiting ? '0s' : `${msgIndex * 0.06}s`,
                                        }}
                                    >
                                        {/* Unread indicator bar */}
                                        {!msg.read && (
                                            <div style={{ height: 3, background: brandTheme.orange, borderRadius: '10px 10px 0 0' }} />
                                        )}

                                        <div style={{ padding: 16 }}>
                                            {/* Row 1: title + time + actions */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                                    {!msg.read && (
                                                        <span className="mb-unread-dot" style={{
                                                            width: 8, height: 8,
                                                            background: brandTheme.orange, flexShrink: 0,
                                                            display: 'inline-block',
                                                        }} />
                                                    )}
                                                    <strong
                                                        onClick={() => toggleExpand(msg.id)}
                                                        style={{ color: brandTheme.navy, fontSize: 16, cursor: 'pointer' }}
                                                    >
                                                        {msg.title}
                                                    </strong>
                                                </div>
                                                <span style={{ color: brandTheme.muted, fontSize: 12, whiteSpace: 'nowrap' }}>{msg.time}</span>
                                            </div>

                                            {/* Row 2: preview / expanded text */}
                                            <p
                                                className={expanded ? 'mb-text-expanded' : undefined}
                                                style={{
                                                    margin: '0 0 12px',
                                                    color: brandTheme.text,
                                                    lineHeight: 1.65,
                                                    fontSize: 14,
                                                    display: expanded ? 'block' : '-webkit-box',
                                                    WebkitLineClamp: expanded ? undefined : 2,
                                                    WebkitBoxOrient: 'vertical' as React.CSSProperties['WebkitBoxOrient'],
                                                    overflow: expanded ? 'visible' : 'hidden',
                                                }}
                                            >
                                                {msg.text}
                                            </p>

                                            {/* Row 3: tag + actions */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                                <span style={{
                                                    borderRadius: 999, padding: '4px 10px',
                                                    background: tag.bg, color: tag.color,
                                                    fontSize: 12, fontWeight: 700,
                                                }}>
                                                    {msg.tag}
                                                </span>

                                                <div style={{ display: 'flex', gap: 6 }}>

                                                    {!msg.read && (
                                                        <button
                                                            onClick={() => markRead(msg.id)}
                                                            title="Marcar como leído"
                                                            className="mb-action-btn"
                                                            style={{
                                                                fontSize: 12, padding: '4px 10px',
                                                                border: `1px solid ${brandTheme.border}`,
                                                                borderRadius: 8, background: '#fff',
                                                                color: brandTheme.muted, cursor: 'pointer',
                                                            }}
                                                        >
                                                            ✓ Leído
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteMessage(msg.id)}
                                                        title="Eliminar mensaje"
                                                        className="mb-action-btn"
                                                        style={{
                                                            fontSize: 12, padding: '4px 8px',
                                                            border: `1px solid ${brandTheme.border}`,
                                                            borderRadius: 8, background: '#fff',
                                                            color: '#E24B4A', cursor: 'pointer',
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>

                        {/* Sidebar */}
                        <aside className="mb-sidebar" style={{ display: 'grid', gap: 14 }}>

                            {/* Quick links */}
                            <div style={{
                                background: brandTheme.creamSoft,
                                border: `1px solid ${brandTheme.border}`,
                                borderRadius: 10, padding: 18,
                            }}>
                                <h2 style={{ margin: '0 0 12px', fontSize: 17, color: brandTheme.navy }}>Accesos rápidos</h2>
                                <div style={{ display: 'grid', gap: 8 }}>
                                    {[
                                        { href: '/ayuda', label: 'Centro de ayuda' },
                                        { href: '/recuperacion', label: 'Cambiar contraseña' },
                                        { href: '/chat', label: 'Abrir chat de soporte' },
                                    ].map(({ href, label }) => (
                                        <a
                                            key={href}
                                            href={href}
                                            className="mb-quicklink"
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                textDecoration: 'none', color: brandTheme.navy,
                                                fontSize: 14, fontWeight: 600,
                                                padding: '8px 10px', borderRadius: 8,
                                                border: `1px solid ${brandTheme.border}`,
                                                background: '#fff',
                                            }}
                                        >
                                            {label}
                                            <span style={{ color: brandTheme.muted, fontSize: 16 }}>›</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>
            </main>
        </PageLayout>
    );
}