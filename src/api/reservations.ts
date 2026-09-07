import { apiReservations } from "../lib/api";
import type { Reserva } from "./types";

export async function createReserva(payload: {
  id_usuario: string;
  id_propiedad: string;
  fecha_inicio: string;
  fecha_fin: string;
}): Promise<Reserva> {
  const { data } = await apiReservations.post<Reserva>("/reservas", payload);
  return data;
}

export async function listReservas(params: {
  usuario_id?: string;
  propiedad_id?: string;
}): Promise<Reserva[]> {
  const { data } = await apiReservations.get<Reserva[]>("/reservas", { params });
  return data;
}

export async function getReserva(id: string): Promise<Reserva> {
  const { data } = await apiReservations.get<Reserva>(`/reservas/${id}`);
  return data;
}

export async function valorarReserva(
  id: string,
  payload: { puntaje: number; comentario: string }
): Promise<Reserva> {
  const { data } = await apiReservations.post<Reserva>(`/reservas/${id}/valoracion`, payload);
  return data;
}
