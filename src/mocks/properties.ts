import type { Propiedad } from "../api/types";

export const MOCK_PROPERTIES: (Propiedad & { rating: number; reviews: number; tag?: string })[] = [
  {
    id: "1", id_anfitrion: "anf-1", titulo: "Loft moderno en Miraflores", descripcion: "Loft luminoso a 2 cuadras del malecón, ideal para parejas.",
    ciudad: "Lima", direccion: "Calle Berlín 200, Miraflores", capacidad: 2, precio_noche: 68,
    imagen_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    created_at: new Date().toISOString(), rating: 4.92, reviews: 214, tag: "Favorito",
  },
  {
    id: "2", id_anfitrion: "anf-2", titulo: "Casa con piscina en Cusco", descripcion: "Casa colonial con patio y vista a los Andes.",
    ciudad: "Cusco", direccion: "San Blas 123", capacidad: 6, precio_noche: 120,
    imagen_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    created_at: new Date().toISOString(), rating: 4.87, reviews: 168, tag: "Nuevo",
  },
  {
    id: "3", id_anfitrion: "anf-1", titulo: "Departamento vista al mar", descripcion: "Frente al Pacífico, amaneceres increíbles.",
    ciudad: "Lima", direccion: "Malecón Cisneros 800", capacidad: 4, precio_noche: 95,
    imagen_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    created_at: new Date().toISOString(), rating: 4.78, reviews: 98,
  },
  {
    id: "4", id_anfitrion: "anf-3", titulo: "Cabaña en el Valle Sagrado", descripcion: "Desconecta en una cabaña de madera entre montañas.",
    ciudad: "Urubamba", direccion: "Valle Sagrado km 12", capacidad: 5, precio_noche: 85,
    imagen_url: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80",
    created_at: new Date().toISOString(), rating: 4.95, reviews: 312, tag: "Top",
  },
  {
    id: "5", id_anfitrion: "anf-2", titulo: "Studio minimalista Barranco", descripcion: "Arte, cafés y galerías a pasos.",
    ciudad: "Lima", direccion: "Jr. Centenario 150", capacidad: 2, precio_noche: 54,
    imagen_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    created_at: new Date().toISOString(), rating: 4.71, reviews: 76,
  },
  {
    id: "6", id_anfitrion: "anf-4", titulo: "Villa con jacuzzi en Paracas", descripcion: "Relax total frente a la bahía.",
    ciudad: "Paracas", direccion: "El Chaco 45", capacidad: 8, precio_noche: 210,
    imagen_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    created_at: new Date().toISOString(), rating: 4.89, reviews: 143,
  },
  {
    id: "7", id_anfitrion: "anf-3", titulo: "Apartamento familiar en Arequipa", descripcion: "Sillar blanco, patio colonial amplio.",
    ciudad: "Arequipa", direccion: "Calle Mercaderes 200", capacidad: 4, precio_noche: 62,
    imagen_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    created_at: new Date().toISOString(), rating: 4.66, reviews: 59,
  },
  {
    id: "8", id_anfitrion: "anf-5", titulo: "Bungalow amazónico en Iquitos", descripcion: "Selva, río y sonidos únicos.",
    ciudad: "Iquitos", direccion: "Río Nanay s/n", capacidad: 3, precio_noche: 48,
    imagen_url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
    created_at: new Date().toISOString(), rating: 4.82, reviews: 87, tag: "Eco",
  },
];

export const CATEGORIES = ["Todos", "Playa", "Campo", "Ciudad", "Montaña", "Eco", "Familiar", "Lujo"];
