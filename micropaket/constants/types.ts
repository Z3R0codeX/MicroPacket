/**
 * Estructura del Usuario basada en la migración de Laravel
 */
export interface User {
  id_user: number;
  username: string;
  email: string;
  seller_rating: string; // Decimal en BD se recibe como string en JSON
  bio?: string | null;
  img?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Estructura de Categoría
 */
export interface Category {
  id_category: number;
  name: string;
 icon?: string | null; // Nuevo campo para el icono de la categoría
  created_at?: string;
  updated_at?: string;
}

/**
 * Estructura de los Servicios (MicroPackages)
 */
export interface MicroPackage {
  id_micro_package: number;
  id_user: number;
  id_category: number;
  title: string;
  description?: string | null;
  price: number; // Laravel lo envía como número o string dependiendo del cast
  delivery_days: number;
  status: 'active' | 'inactive' | 'paused' | string;
  img?: string | null;
  
  // Relaciones cargadas con "with" en Laravel
  user?: User;
  category?: Category;
  created_at?: string;
  updated_at?: string;
}

/**
 * Estructura de las Órdenes de Servicio
 */
export interface Order {
  id_order: number;
  id_user: number;
  id_micro_package: number;
  id_proposal?: number | null;
  price: number;
  status: string;
  start_day?: string | null;
  end_day?: string | null;
  
  // Relaciones cargadas con "with"
  user?: User;
  micro_package?: MicroPackage;
  proposal?: any; // Definido como any hasta tener el modelo de propuestas
  created_at?: string;
  updated_at?: string;
}

/**
 * Respuesta típica de autenticación (Login/Register)
 */
export interface AuthResponse {
  user: User;
  token: string;
}