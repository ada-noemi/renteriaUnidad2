import React from 'react';
import CategoryDetailPage from '../components/CategoryDetailPage';
import { products } from '../siteData';

export default function ReptilesCategoryView({ isAuthenticated }: { isAuthenticated: boolean }) {
    const categoryProducts = products.filter((product) => product.petType === 'reptiles');

    return (
        <CategoryDetailPage
            title="Reptiles"
            description="La vista de Reptiles ya queda separada para crecer como categoría individual, aunque todavía no tenga productos cargados."
            isAuthenticated={isAuthenticated}
            products={categoryProducts}
            registerMessage="Como invitado puedes entrar a la categoría, pero la lista completa de productos para Reptiles se habilita cuando te registras o inicias sesión."
        />
    );
}