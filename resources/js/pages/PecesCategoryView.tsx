import React from 'react';
import CategoryDetailPage from '../components/CategoryDetailPage';
import { products } from '../siteData';

export default function PecesCategoryView({ isAuthenticated }: { isAuthenticated: boolean }) {
    const categoryProducts = products.filter((product) => product.petType === 'peces');

    return (
        <CategoryDetailPage
            title="Peces"
            description="La vista de Peces concentra el catálogo acuático para mantener separados los productos de peceras, accesorios y alimentación."
            isAuthenticated={isAuthenticated}
            products={categoryProducts}
            registerMessage="Como invitado puedes entrar a la categoría, pero la lista completa de productos para Peces se habilita cuando te registras o inicias sesión."
        />
    );
}