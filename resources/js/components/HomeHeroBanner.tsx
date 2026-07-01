import React, { useEffect, useState } from 'react';
import { brandTheme } from '../theme';

type Slide = {
    id: number;
    title: string;
    description: string;
    image: string;
};

const slides: Slide[] = [
    {
        id: 1,
        title: '',
        description: '',
        image: '/images/banner1.png',
    },
    {
        id: 2,
        title: '',
        description: '',
        image: '/images/banner2.png',
    },
];

const SLIDE_DURATION_MS = 4500;

// Estilos de animación (keyframes) inyectados una sola vez
const animationStyles = `
@keyframes heroBgFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes heroKenBurns {
    from { transform: scale(1); }
    to { transform: scale(1.07); }
}

@keyframes heroTextSlideUp {
    from {
        opacity: 0;
        transform: translateY(24px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes heroProgressFill {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
}

.hero-bg-layer {
    animation: heroBgFadeIn 1.1s ease-out;
}

.hero-bg-image {
    animation: heroKenBurns ${SLIDE_DURATION_MS + 600}ms ease-out both;
}

.hero-text-layer {
    animation: heroTextSlideUp 0.8s ease-out;
}

.hero-dot {
    transition: transform 0.2s ease, background-color 0.2s ease;
}
.hero-dot:hover {
    transform: scale(1.15);
}

.hero-progress-track {
    overflow: hidden;
}
.hero-progress-fill {
    transform-origin: left;
    animation: heroProgressFill ${SLIDE_DURATION_MS}ms linear;
}
.hero-progress-fill.paused {
    animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
    .hero-bg-layer, .hero-bg-image, .hero-text-layer, .hero-dot, .hero-progress-fill {
        animation: none !important;
        transition: none !important;
    }
}
`;

export default function HomeHeroBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;

        const intervalId = window.setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, SLIDE_DURATION_MS);

        return () => window.clearInterval(intervalId);
    }, [paused]);

    const currentSlide = slides[currentIndex];

    return (
        <section
            id="promociones"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
                color: brandTheme.creamSoft,
                minHeight: 'clamp(340px, 62vh, 700px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                padding: 'clamp(18px, 4vw, 34px)',
            }}
        >
            <style>{animationStyles}</style>

            <div
                key={currentSlide.id}
                className="hero-bg-layer"
                style={{
                    position: 'absolute',
                    inset: 0,
                    overflow: 'hidden',
                    zIndex: 0,
                }}
            >
                <div
                    className="hero-bg-image"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `linear-gradient(120deg, rgba(12, 40, 62, 0.28), rgba(18, 58, 87, 0.18)), url(${currentSlide.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            </div>

            <div
                style={{
                    maxWidth: 1180,
                    margin: '0 auto',
                    width: '100%',
                    minHeight: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* Capa de texto: también se remonta con "key" para que la animación
                    de entrada se repita en cada cambio de slide */}
                <div key={currentSlide.id} className="hero-text-layer">
                    <h2 style={{ margin: 0 }}>{currentSlide.title}</h2>
                    <p style={{ marginTop: 12 }}>{currentSlide.description}</p>
                </div>

                {/* Indicadores + barra de progreso del autoplay */}
                {slides.length > 1 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
                        {slides.map((slide, index) => {
                            const active = index === currentIndex;
                            return (
                                <button
                                    key={slide.id}
                                    type="button"
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Ir al slide ${index + 1}`}
                                    className="hero-dot"
                                    style={{
                                        width: active ? 28 : 8,
                                        height: 8,
                                        borderRadius: 999,
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        background: active ? 'transparent' : 'rgba(255, 255, 255, 0.4)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {active ? (
                                        <span
                                            key={`${slide.id}-${paused}`}
                                            className="hero-progress-track"
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                borderRadius: 999,
                                                background: 'rgba(255, 255, 255, 0.35)',
                                            }}
                                        >
                                            <span
                                                className={`hero-progress-fill${paused ? ' paused' : ''}`}
                                                style={{
                                                    display: 'block',
                                                    width: '100%',
                                                    height: '100%',
                                                    background: brandTheme.orange,
                                                    borderRadius: 999,
                                                }}
                                            />
                                        </span>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </section>
    );
}