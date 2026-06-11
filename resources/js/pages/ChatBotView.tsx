import React from 'react';
import PageLayout from '../components/PageLayout';
import { products } from '../siteData';
import { brandTheme } from '../theme';

type ChatMessage = {
    from: 'bot' | 'user';
    text: string;
    timestamp: Date;
};

const STORAGE_KEY = 'petword_chat_history';

function buildReply(text: string): string {
    const query = text.toLowerCase();

    if (query.includes('precio') || query.includes('producto') || query.includes('alimento')) {
        const sample = products.slice(0, 4).map((p) => `${p.name} ($${p.price})`).join(', ');
        return `Tenemos productos como: ${sample}. Puedes ver el catálogo completo en /productos.`;
    }
    if (query.includes('contrasena') || query.includes('contraseña') || query.includes('password') || query.includes('recuper')) {
        return 'Para recuperar tu acceso ve a /recuperacion, ingresa tu correo y define una nueva contraseña. El enlace expira en 30 minutos.';
    }
    if (query.includes('buzon') || query.includes('buzón') || query.includes('mensaje') || query.includes('notif')) {
        return 'Tu buzón guarda avisos de compra, seguimiento de pedidos, soporte y recordatorios de cuenta. Puedes acceder desde el icono de campana.';
    }
    if (query.includes('envio') || query.includes('envío') || query.includes('entrega') || query.includes('pedido')) {
        return 'Los pedidos se procesan en 24 h y el tiempo de entrega es de 2 a 5 días hábiles dependiendo tu ubicación.';
    }
    if (query.includes('pago') || query.includes('tarjeta') || query.includes('transferencia')) {
        return 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard), transferencia bancaria y pago en efectivo en tiendas de conveniencia.';
    }
    if (query.includes('devolucion') || query.includes('devolución') || query.includes('cambio') || query.includes('reembolso')) {
        return 'Tienes 15 días para solicitar devoluciones o cambios. El producto debe estar sin abrir. Escríbenos a /contacto para iniciar el proceso.';
    }
    if (query.includes('contacto') || query.includes('ayuda') || query.includes('soporte') || query.includes('humano')) {
        return 'Puedes contactar a nuestro equipo en /contacto o llamar al 800-PET-WORD de lunes a viernes de 9 a 18 h. También puedo resolver muchas dudas aquí.';
    }
    if (query.includes('hola') || query.includes('buenas') || query.includes('buenos')) {
        return '¡Hola! ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre productos, pedidos, pagos, envíos o recuperación de contraseña.';
    }
    if (query.includes('gracias') || query.includes('perfecto') || query.includes('listo')) {
        return '¡Con gusto! Si necesitas algo más no dudes en escribirme. 🐾';
    }

    return 'Puedo ayudarte con: productos, pedidos, pagos, envíos, devoluciones, buzón o recuperación de contraseña. ¿Sobre cuál de estos tienes una pregunta?';
}

function formatTime(date: Date): string {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

function loadHistory(): ChatMessage[] {
    try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.map((m: { from: 'bot' | 'user'; text: string; timestamp: string }) => ({
                ...m,
                timestamp: new Date(m.timestamp),
            }));
        }
    } catch {
        // ignore parse errors
    }
    return [
        {
            from: 'bot',
            text: 'Hola, soy el asistente de PetWord. ¿En qué puedo ayudarte hoy?',
            timestamp: new Date(),
        },
    ];
}

const QUICK_ACTIONS = ['Ver productos', 'Rastrear pedido', 'Métodos de pago', 'Hablar con soporte'];

export default function ChatBotView() {
    const [input, setInput] = React.useState('');
    const [messages, setMessages] = React.useState<ChatMessage[]>(loadHistory);
    const [isTyping, setIsTyping] = React.useState(false);
    const bottomRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    React.useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        } catch {
            // ignore storage errors
        }
    }, [messages]);

    function sendMessage(text: string) {
        const trimmed = text.trim();
        if (!trimmed) return;

        const userMsg: ChatMessage = { from: 'user', text: trimmed, timestamp: new Date() };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const botMsg: ChatMessage = {
                from: 'bot',
                text: buildReply(trimmed),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMsg]);
            setIsTyping(false);
        }, 800 + Math.random() * 600);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        sendMessage(input);
    }

    function clearHistory() {
        const initial: ChatMessage = {
            from: 'bot',
            text: 'Conversación reiniciada. ¿En qué puedo ayudarte?',
            timestamp: new Date(),
        };
        setMessages([initial]);
        sessionStorage.removeItem(STORAGE_KEY);
        inputRef.current?.focus();
    }

    return (
        <PageLayout>
            <main style={{ maxWidth: 700, margin: '0 auto', padding: '34px 16px 56px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                        <span style={{ color: brandTheme.orange, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Soporte
                        </span>
                        <h1 style={{ margin: '6px 0 6px', color: brandTheme.navy, fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 700 }}>
                            Asistente PetWord
                        </h1>
                        <p style={{ margin: 0, color: brandTheme.muted, fontSize: 14, lineHeight: 1.5 }}>
                            Respuesta inmediata · disponible 24/7
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{
                            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                            background: '#22c55e', boxShadow: '0 0 0 2px rgba(34,197,94,0.25)',
                        }} />
                        <span style={{ fontSize: 13, color: brandTheme.muted }}>En línea</span>
                    </div>
                </div>

                {/* Chat container */}
                <div style={{
                    background: '#fff',
                    border: `1px solid ${brandTheme.border}`,
                    borderRadius: 14,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: 520,
                    boxShadow: '0 4px 24px rgba(12,40,62,0.08)',
                }}>
                    {/* Toolbar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 16px',
                        borderBottom: `1px solid ${brandTheme.border}`,
                        background: brandTheme.creamSoft,
                    }}>
                        <span style={{ fontSize: 13, color: brandTheme.muted }}>
                            {messages.length - 1} {messages.length === 2 ? 'mensaje' : 'mensajes'}
                        </span>
                        <button
                            onClick={clearHistory}
                            title="Limpiar conversación"
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: 12, color: brandTheme.muted, padding: '4px 8px',
                                borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4,
                            }}
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <polyline points="1 4 1 10 7 10" /><polyline points="23 20 23 14 17 14" />
                                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
                            </svg>
                            Limpiar
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px 16px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                    }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start',
                                    gap: 3,
                                }}
                            >
                                {/* Avatar label */}
                                <span style={{ fontSize: 11, color: brandTheme.muted, paddingLeft: msg.from === 'bot' ? 2 : 0, paddingRight: msg.from === 'user' ? 2 : 0 }}>
                                    {msg.from === 'bot' ? 'Asistente' : 'Tú'} · {formatTime(msg.timestamp)}
                                </span>
                                <div style={{
                                    maxWidth: 'min(80%, 480px)',
                                    background: msg.from === 'user' ? brandTheme.navy : brandTheme.creamSoft,
                                    color: msg.from === 'user' ? '#fff' : brandTheme.text,
                                    border: `1px solid ${msg.from === 'user' ? 'transparent' : brandTheme.border}`,
                                    borderRadius: msg.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                    padding: '10px 14px',
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                                <span style={{ fontSize: 11, color: brandTheme.muted, paddingLeft: 2 }}>Asistente</span>
                                <div style={{
                                    background: brandTheme.creamSoft,
                                    border: `1px solid ${brandTheme.border}`,
                                    borderRadius: '14px 14px 14px 4px',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    gap: 5,
                                    alignItems: 'center',
                                }}>
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            style={{
                                                width: 7, height: 7, borderRadius: '50%',
                                                background: brandTheme.muted,
                                                display: 'inline-block',
                                                animation: 'bounce 1.2s infinite',
                                                animationDelay: `${i * 0.2}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick actions */}
                    <div style={{
                        padding: '8px 16px',
                        borderTop: `1px solid ${brandTheme.border}`,
                        display: 'flex',
                        gap: 6,
                        flexWrap: 'wrap',
                        background: '#fff',
                    }}>
                        {QUICK_ACTIONS.map((action) => (
                            <button
                                key={action}
                                onClick={() => sendMessage(action)}
                                disabled={isTyping}
                                style={{
                                    fontSize: 12, padding: '5px 10px',
                                    border: `1px solid ${brandTheme.border}`,
                                    borderRadius: 20, background: '#fff',
                                    color: brandTheme.navy, cursor: 'pointer',
                                    transition: 'background 0.15s, color 0.15s',
                                    opacity: isTyping ? 0.5 : 1,
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.background = brandTheme.navy;
                                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                                    (e.currentTarget as HTMLButtonElement).style.color = brandTheme.navy;
                                }}
                            >
                                {action}
                            </button>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} style={{
                        borderTop: `1px solid ${brandTheme.border}`,
                        padding: '12px 14px',
                        display: 'flex',
                        gap: 10,
                        background: '#fff',
                        alignItems: 'center',
                    }}>
                        <input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Escribe tu pregunta…"
                            disabled={isTyping}
                            style={{
                                flex: 1, minWidth: 0,
                                borderRadius: 24,
                                border: `1px solid ${brandTheme.border}`,
                                padding: '10px 16px',
                                fontSize: 14,
                                outline: 'none',
                                background: brandTheme.creamSoft,
                                transition: 'border-color 0.15s',
                            }}
                            onFocus={(e) => (e.currentTarget.style.borderColor = brandTheme.navy)}
                            onBlur={(e) => (e.currentTarget.style.borderColor = brandTheme.border)}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            style={{
                                border: 'none',
                                borderRadius: '50%',
                                width: 40, height: 40,
                                flexShrink: 0,
                                background: input.trim() && !isTyping ? brandTheme.navy : brandTheme.border,
                                color: '#fff',
                                cursor: input.trim() && !isTyping ? 'pointer' : 'default',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.2s',
                            }}
                            aria-label="Enviar"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                            </svg>
                        </button>
                    </form>
                </div>

                {/* Bounce keyframes */}
                <style>{`
                    @keyframes bounce {
                        0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
                        30% { transform: translateY(-5px); opacity: 1; }
                    }
                `}</style>
            </main>
        </PageLayout>
    );
}