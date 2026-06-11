import React from 'react';
import CategoryDetailPage from '../components/CategoryDetailPage';
import { products } from '../siteData';

export default function PerrosCategoryView({ isAuthenticated }: { isAuthenticated: boolean }) {
    const dogProducts = products.filter((product) => product.petType === 'perro');

    return (
        <CategoryDetailPage
            title="Perros"
            description="Esta es la primera vista individual por categoría. Aquí se concentrarán los productos y contenidos propios de Perros sin mezclarlos con las demás categorías."
            isAuthenticated={isAuthenticated}
            products={dogProducts}
            registerMessage="Como invitado puedes entrar a la categoría, pero la lista completa de productos para Perros se habilita cuando te registras o inicias sesión."
        />
    );
}