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

// Auth JWT — user_microservice POST /login/
export interface UsuarioLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario_id: string;
  rol: Rol;
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

// Reservations — contrato real reservations_microservice (MongoDB)
export interface Reserva {
  _id: string;
  id_huesped: string;
  id_propiedad: number;
  fecha_checkin: string;
  fecha_checkout: string;
  precio_total: number;
  estado_reserva: "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "COMPLETADA";
  fecha_creacion: string;
}

export interface Resena {
  _id: string;
  id_reserva: string;
  id_propiedad: number;
  id_huesped: string;
  calificacion: number;
  comentario?: string;
  fecha_creacion: string;
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
