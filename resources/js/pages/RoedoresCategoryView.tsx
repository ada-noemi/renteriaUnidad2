import React from 'react';
import CategoryDetailPage from '../components/CategoryDetailPage';
import { products } from '../siteData';

export default function RoedoresCategoryView({ isAuthenticated }: { isAuthenticated: boolean }) {
    const categoryProducts = products.filter((product) => product.petType === 'pequenas-especies');

    return (
        <CategoryDetailPage
            title="Roedores"
            description="La vista de Roedores reúne productos de pequeñas especies en una pantalla separada para mostrar su propio catálogo."
            isAuthenticated={isAuthenticated}
            products={categoryProducts}
            registerMessage="Como invitado puedes entrar a la categoría, pero la lista completa de productos para Roedores se habilita cuando te registras o inicias sesión."
        />
    );
}