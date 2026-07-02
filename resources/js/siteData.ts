export type Category = {
    id: number;
    name: string;
    slug: string;
    image: string;
};

export type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
    petType: 'perro' | 'gato' | 'peces' | 'aves' | 'pequenas-especies' | 'reptiles';
    image?: string;
};

export type SitePage = {
    id: string;
    title: string;
    description: string;
    href: string;
    section: 'principal' | 'adicional';
};

export const categories: Category[] = [
    { id: 1, name: 'Peces', slug: 'peces', image: '/images/categories/pez.webp' },
    { id: 2, name: 'Perros', slug: 'perros', image: '/images/categories/perro.webp' },
    { id: 3, name: 'Gatos', slug: 'gatos', image: '/images/categories/gato.webp' },
    { id: 4, name: 'Roedores', slug: 'roedores', image: '/images/categories/roedores.webp' },
    { id: 5, name: 'Aves', slug: 'aves', image: '/images/categories/aves.webp' },
    { id: 6, name: 'Reptiles', slug: 'reptiles', image: '/images/categories/reptiles.webp' },
];

export const dogProducts: Product[] = [
    { id: 1, name: 'Croquetas Premium', price: 349, category: 'Alimento Seco', petType: 'perro', image: '/images/products/croquetas.jpg' },
    { id: 2, name: 'Juguete Mordedera', price: 129, category: 'Accesorios', petType: 'perro', image: '/images/products/mordedera.webp' },
    { id: 11, name: "HILL'S PRESCRIPTION DIET - Kidney Care Alimento Humedo En Lata Para Perro Adulto Problemas Renales k/d 354 g", price: 125,  petType: 'perro', category: 'Alimento Humedo', image: '/images/products/hills.webp' },
    { id: 12, name: 'MSD Scalibor - Collar Antipulgas Para Perro Hasta 65 Cm', price: 399.2,  petType: 'perro', category: 'Accesorios', image: '/images/products/scalibor}.webp' },
    { id: 13, name: 'FANCY PETS - Plato De Acero Para Mascotas', price: 189,  petType: 'perro', category: 'Accesorios', image: '/images/products/fancy.webp' },
    { id: 14, name: 'BAMITOL - Unguento Para Inflamaciones y Moretones 200 gr', price: 267.2,  petType: 'perro', category: 'Salud', image: '/images/products/batimol.webp' },
    { id: 15, name: 'SERESTO - Collar Antipulgas y Garrapatas Para Perros Mayores a 8 Kg', price: 959.2,  petType: 'perro', category: 'Accesorios', image: '/images/products/seresto.webp' },
    { id: 16, name: 'VAN NESS - Bebedero Automatico Para Perro 1.5 Lt', price: 259,  petType: 'perro', category: 'Accesorios', image: '/images/products/van.webp' },
    { id: 17, name: 'BOLFO - Super Bolfo Reforzado Aerosol Antipulgas Para Perro 430 ml', price: 249,  petType: 'perro', category: 'Salud', image: '/images/products/bolfo.webp' },
    { id: 18, name: 'Naughty Dog - Cama Para Perros Acolchonada KIRA', price: 979,  petType: 'perro', category: 'Accesorios', image: '/images/products/cama.webp' },
];

export const catProducts: Product[] = [
    { id: 3, name: 'Arena Sanitaria', price: 95, category: 'Higiene', petType: 'gato', image: '/images/products/arena.webp' },
    { id: 4, name: 'Rascador', price: 219, category: 'Accesorios', petType: 'gato', image: '/images/products/rascador.webp' },
    { id: 19, name: 'MPS - Arenero con Tapa y Puerta Para Gato', price: 589, category: 'Areneros', petType: 'gato', image: '/images/products/mps.webp' },
    { id: 20, name: 'CHURU - Premio Para Gato Premium Bisque Atun', price: 45, category: 'Premios', petType: 'gato', image: '/images/products/churu.webp' },
    { id: 21, name: 'ADVANTAGE MULTI - Desparasitante para Gatos Chico', price: 449, category: 'Salud', petType: 'gato', image: '/images/products/advantage.webp' },
    { id: 22, name: 'FANCY PETS - Cepillo Para Gato Con Puntas Redondas', price: 79, category: 'Higiene', petType: 'gato', image: '/images/products/cepillo.webp' },
    { id: 23, name: 'FANCY PETS - Neutralizador De Olores Para Arenero De Gato 250 ml', price: 109, category: 'Higiene', petType: 'gato', image: '/images/products/neutralizador.webp' },
    { id: 24, name: 'FANCY PETS - Juguete Para Gato Raton Con Peluche', price: 36, category: 'Juguetes', petType: 'gato', image: '/images/products/juguete.webp' },
    { id: 25, name: 'FANCY PETS - Tijera Cortaunas Para Gato Grande', price: 169, category: 'Higiene', petType: 'gato', image: '/images/products/tijeras.webp' },
    { id: 26, name: 'MPS - Transportadora SKUDO IATA 5 Gris', price: 2799.2, category: 'Transportadoras', petType: 'gato', image: '/images/products/transportadora.webp' },
]

export const fishProducts: Product[] = [
    { id: 5, name: 'Alimento para Peces', price: 45, category: 'Alimentos', petType: 'peces', image: '/images/products/alimento peces.webp' },
    { id: 6, name: 'Acuario Basico', price: 399, category: 'Acuarios', petType: 'peces', image: '/images/products/lampara.webp' },
    { id: 27, name: 'GRUPO LOMAS - Alimentos Para Peces Tropicales Wardley Hojuelas Basicas 30 g', price: 44, category: 'Alimentos', petType: 'peces', image: '/images/products/alimento.webp' },
    { id: 28, name: 'TETRA - TetraWeekend Alimento En Gel Para Peces 24 g', price: 129, category: 'Alimentos', petType: 'peces', image: '/images/products/tetra.webp' },
    { id: 29, name: 'GRUPO LOMAS - Azul De Metileno Para Peces 30 ml', price: 18, category: 'Salud', petType: 'peces', image: '/images/products/azul.webp' },
    { id: 30, name: 'GRUPO LOMAS - Alimento Spirulina Boost Para Peces 70 g', price: 28, category: 'Alimentos', petType: 'peces', image: '/images/products/lomas.webp' },
    { id: 31, name: 'GRUPO LOMAS - Acondicionador Anticloro Con Vitamina B1 Para Acuarios 30 ml', price: 14, category: 'Acuarios', petType: 'peces', image: '/images/products/acondicionador.webp' },
    { id: 32, name: 'GRUPO LOMAS - Alimento Para Peces Tropicales Wardley Hojuelas Basicas 100 g', price: 126, category: 'Alimentos', petType: 'peces', image: '/images/products/tropi.webp' },
    { id: 33, name: 'TETRA - TetraBetta Alimento En Bolitas Para Peces Betta 29 g', price: 79, category: 'Alimentos', petType: 'peces', image: '/images/products/alimento peces.webp' },
];

export const birdProducts: Product[] = [
    { id: 7, name: 'Jaula para Aves', price: 239, category: 'Jaulas', petType: 'aves', image: '/images/products/jaula.webp' },
    { id: 8, name: 'Juguete para Canarios', price: 89, category: 'Juguetes', petType: 'aves', image: '/images/products/canarios.webp' },
];

export const rodentProducts: Product[] = [
    { id: 9, name: 'Heno Premium', price: 149, category: 'Roedores', petType: 'pequenas-especies', image: '/images/products/heno.webp' },
    { id: 10, name: 'Casa para Roedor', price: 199, category: 'Habitat', petType: 'pequenas-especies', image: '/images/products/casa roedores.png' },
    { id: 34, name: 'REDKITE - Ferret Diet Alimento Para Huron Pellet 1 Kg', price: 176, category: 'Alimentos', petType: 'pequenas-especies', image: '/images/products/ferret.webp' },
    { id: 35, name: 'OXBOW - Premios Para Conejos Manzana y Platano 85 g', price: 149, category: 'Premios', petType: 'pequenas-especies', image: '/images/products/oxbow.webp' },
    { id: 36, name: 'REDKITE - Bebedero Mediano Antigoteo Para Peq. Especies 125 ml', price: 87.2, category: 'Accesorios', petType: 'pequenas-especies', image: '/images/products/redkite.webp' },
    { id: 37, name: 'SUNNY - Alfalfa Para Pequenas Especies Standlee 680 g', price: 279, category: 'Alimentos', petType: 'pequenas-especies', image: '/images/products/alfalfa.webp' },
    { id: 38, name: 'SUNNY - Juguete Bola Grande Ejercicio Para Pequenas Especies Varios Colores', price: 129, category: 'Juguetes', petType: 'pequenas-especies', image: '/images/products/bola.webp' },
    { id: 39, name: 'SUNNY - Pasto Timothy Para Pequenas Especies Standlee 510 g', price: 199, category: 'Alimentos', petType: 'pequenas-especies', image: '/images/products/sunny.webp' },
    { id: 40, name: 'CHISPI - Lecho De Madera Para Roedores Sustrato Olor Manzana 15 L', price: 99, category: 'Higiene', petType: 'pequenas-especies', image: '/images/products/chispi.webp' },
];

export const reptileProducts: Product[] = [];

export const products: Product[] = [
    ...dogProducts,
    ...catProducts,
    ...fishProducts,
    ...birdProducts,
    ...rodentProducts,
    ...reptileProducts,
];

export const sitePages: SitePage[] = [
    { id: 'inicio', title: 'Inicio11', description: 'Portada principal del sitio.', href: '/', section: 'principal' },
    { id: 'categorias', title: 'Categorías', description: 'Explora categorías de mascotas.', href: '/categorias', section: 'principal' },
    { id: 'productos', title: 'Productos', description: 'Catálogo de productos disponibles.', href: '/productos', section: 'principal' },
    { id: 'registrar', title: 'Registrar', description: 'Alta de nuevos usuarios.', href: '/registrar', section: 'adicional' },
    { id: 'buzon', title: 'Buzón', description: 'Mensajes y notificaciones.', href: '/buzon', section: 'adicional' },
    { id: 'login', title: 'Inicio de sesión', description: 'Acceso de usuarios registrados.', href: '/login', section: 'adicional' },
    { id: 'ayuda', title: 'Ayuda', description: 'Soporte y preguntas frecuentes.', href: '/ayuda', section: 'adicional' },
    { id: 'contacto', title: 'Contáctanos', description: 'Canales de soporte y contacto.', href: '/contacto', section: 'adicional' },
    { id: 'recuperacion', title: 'Recuperación de contraseña', description: 'Recupera el acceso a tu cuenta.', href: '/recuperacion', section: 'adicional' },
    { id: 'chat', title: 'Chat', description: 'Atencion en linea para el usuario.', href: '/chat', section: 'adicional' },
    { id: 'mapa-del-sitio', title: 'Mapa del sitio', description: 'Estructura general de la navegación.', href: '/mapa-del-sitio', section: 'adicional' },
    { id: 'carrito', title: 'Carrito', description: 'Vista estática del carrito.', href: '/carrito', section: 'adicional' },
];