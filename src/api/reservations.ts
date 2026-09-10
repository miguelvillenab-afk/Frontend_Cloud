import { apiReservations } from "../lib/api";
import type { Reserva, Resena } from "./types";

// Contrato real: reservations_microservice (Express + Mongo, :3000)
// POST /reservas/ {id_huesped, id_propiedad:number, fecha_checkin, fecha_checkout}
export async function createReserva(payload: {
  id_huesped: string;
  id_propiedad: number;
  fecha_checkin: string;
  fecha_checkout: string;
}): Promise<Reserva> {
  const { data } = await apiReservations.post<Reserva>("/reservas/", payload);
  return data;
}

export async function listReservasByHuesped(id_huesped: string): Promise<Reserva[]> {
  const { data } = await apiReservations.get<Reserva[]>(`/reservas/huesped/${id_huesped}`);
  return data;
}

export async function getReserva(id: string): Promise<Reserva> {
  const { data } = await apiReservations.get<Reserva>(`/reservas/${id}`);
  return data;
}

export async function updateEstadoReserva(
  id: string,
  estado_reserva: "PENDIENTE" | "CONFIRMADA" | "CANCELADA" | "COMPLETADA"
): Promise<Reserva> {
  const { data } = await apiReservations.patch<Reserva>(`/reservas/${id}/estado`, {
    estado_reserva,
  });
  return data;
}

export async function createResena(payload: {
  id_reserva: string;
  calificacion: number;
  comentario?: string;
}): Promise<Resena> {
  const { data } = await apiReservations.post<Resena>("/resenas/", payload);
  return data;
}

export async function listResenasByPropiedad(id_propiedad: number): Promise<Resena[]> {
  const { data } = await apiReservations.get<Resena[]>(`/resenas/propiedad/${id_propiedad}`);
  return data;
}
