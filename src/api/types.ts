// DTOs compartidos — alineados con user_microservice/app/schemas.py:22 y contratos propuestos

export type Rol = "HUESPED" | "ANFITRION";

export interface MetodoPago {
  id_metodo: number;
  id_usuario: string;
  tipo_tarjeta: string;
  ultimos_cuatro: string;
}

export interface Usuario {
  id_usuario: string;
  nombre: string;
  email: string;
  rol: Rol;
  fecha_registro: string;
  metodos_pago: MetodoPago[];
}

export interface UsuarioCreate {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}

export interface MetodoPagoCreate {
  tipo_tarjeta: string;
  ultimos_cuatro: string;
}

// Properties (propuesto - validar contra Swagger cuando exista)
export interface Propiedad {
  id: string;
  id_anfitrion: string;
  titulo: string;
  descripcion: string;
  ciudad: string;
  direccion: string;
  capacidad: number;
  precio_noche: number;
  imagen_url?: string;
  created_at: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Reservations (propuesto)
export interface Reserva {
  id: string;
  id_usuario: string;
  id_propiedad: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: "PENDIENTE" | "CONFIRMADA" | "CANCELADA";
  puntaje?: number;
  comentario?: string;
}

// Dashboard agregador
export interface DashboardResumen {
  usuario: Usuario;
  propiedades?: Propiedad[];
  reservas: Reserva[];
  totalReservas: number;
}

// Analytics
export interface MetricaOcupacion {
  fecha: string;
  ocupacion_pct: number;
}
export interface MetricaIngresos {
  periodo: string;
  ingresos: number;
}
