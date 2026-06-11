import React from 'react';
import CategoryDetailPage from '../components/CategoryDetailPage';
import { products } from '../siteData';

export default function AvesCategoryView({ isAuthenticated }: { isAuthenticated: boolean }) {
    const categoryProducts = products.filter((product) => product.petType === 'aves');

    return (
        <CategoryDetailPage
            title="Aves"
            description="La vista de Aves ordena los productos de jaulas, juguetes y accesorios para mostrar esta categoría como un catálogo independiente."
            isAuthenticated={isAuthenticated}
            products={categoryProducts}
            registerMessage="Como invitado puedes entrar a la categoría, pero la lista completa de productos para Aves se habilita cuando te registras o inicias sesión."
        />
    );
}