import React from 'react';

type Category = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
};

const categories: Category[] = [
    { id: 1, name: 'Perros' },
    { id: 2, name: 'Gatos' },
    { id: 3, name: 'Mamiferos' },
    { id: 4, name: 'Reptiles' },
    { id: 5, name: 'Primates' },
    { id: 6, name: 'Aves' },
    { id: 7, name: 'Peces' },
];

const products: Product[] = [
    { id: 1, name: 'Croquetas Premium', price: 349, category: 'Perros' },
    { id: 2, name: 'Juguete Mordedera', price: 129, category: 'Perros' },
    { id: 3, name: 'Arena Sanitaria', price: 95, category: 'Gatos' },
    { id: 4, name: 'Rascador', price: 219, category: 'Gatos' },
    { id: 5, name: 'Lampara UVB', price: 299, category: 'Reptiles' },
    { id: 6, name: 'Alimento para Peces', price: 45, category: 'Peces' },
    { id: 7, name: 'Jaula para Aves', price: 239, category: 'Aves' },
    { id: 8, name: 'Snacks Naturales', price: 159, category: 'Primates' },
];

export default function Home() {
    return (
        <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#f5f7fb', minHeight: '100vh' }}>
            <header style={{ background: '#0f4c81', color: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0 }}>PetWord</h1>
                <div style={{ fontWeight: 600 }}>Carrito: 0</div>
            </header>

            <main style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
                <h2 style={{ color: '#0f4c81' }}>Categorias</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, marginBottom: 24 }}>
                    <button type="button" style={{ border: '1px solid #c9d5e5', borderRadius: 12, background: '#dff1ff', padding: 12, cursor: 'default' }}>
                        Todos
                    </button>
                    {categories.map((category) => (
                        <button key={category.id} type="button" style={{ border: '1px solid #c9d5e5', borderRadius: 12, background: '#fff', padding: 12, cursor: 'default' }}>
                            {category.name}
                        </button>
                    ))}
                </div>

                <h2 style={{ color: '#0f4c81' }}>Productos</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                    {products.map((product) => (
                        <article key={product.id} style={{ background: '#fff', border: '1px solid #dde6f2', borderRadius: 14, overflow: 'hidden' }}>
                            <div style={{ padding: 12 }}>
                                <h3 style={{ marginTop: 0, marginBottom: 6 }}>{product.name}</h3>
                                <p style={{ marginTop: 0, color: '#4f5f79' }}>{product.category}</p>
                                <p style={{ margin: '8px 0', fontWeight: 700 }}>${product.price}.00</p>
                                <button type="button" style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: 'none', background: '#0f4c81', color: '#fff', cursor: 'default' }}>
                                    Agregar al carrito
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
