import React from 'react';
import CategoryDetailPage from '../components/CategoryDetailPage';
import { products } from '../siteData';

export default function GatosCategoryView({ isAuthenticated }: { isAuthenticated: boolean }) {
    const categoryProducts = products.filter((product) => product.petType === 'gato');

    return (
        <CategoryDetailPage
            title="Gatos"
            description="La vista de Gatos reúne los productos propios del cuidado felino y mantiene el catálogo separado de las demás categorías."
            isAuthenticated={isAuthenticated}
            products={categoryProducts}
            registerMessage="Como invitado puedes entrar a la categoría, pero la lista completa de productos para Gatos se habilita cuando te registras o inicias sesión."
        />
    );
}