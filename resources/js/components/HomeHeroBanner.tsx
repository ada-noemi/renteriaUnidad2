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
        title: 'Promociones semanales para consentir a tu mascota',
        description: 'Descuentos en alimento, juguetes y accesorios para perros, gatos y más.',
        image: '/images/banner1.png',
    },
    {
        id: 2,
        title: 'Más vendidos por categoría en una sola vista',
        description: 'Encuentra rápido lo que más compran otros usuarios por tipo de mascota.',
        image: '/images/banner2.png',
    },
];

export default function HomeHeroBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 4500);

        return () => window.clearInterval(intervalId);
    }, []);

    const currentSlide = slides[currentIndex];

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    };

    return (
        <section
            id="promociones"
            style={{
                color: brandTheme.creamSoft,
                minHeight: 'clamp(340px, 62vh, 700px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundImage: `linear-gradient(120deg, rgba(12, 40, 62, 0.28), rgba(18, 58, 87, 0.18)), url(${currentSlide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                overflow: 'hidden',
                padding: 'clamp(18px, 4vw, 34px)',
            }}
        >
            <div style={{ maxWidth: 1180, margin: '0 auto', width: '100%', minHeight: 'inherit', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            </div>
        </section>
    );
}
