import { apiUsers } from "../lib/api";
import type { MetodoPago, MetodoPagoCreate, Usuario, UsuarioCreate } from "./types";

// Endpoints reales: user_microservice/app/main.py:16,23,30
export async function createUser(payload: UsuarioCreate): Promise<Usuario> {
  const { data } = await apiUsers.post<Usuario>("/usuarios/", payload);
  return data;
}

export async function getUser(usuario_id: string): Promise<Usuario> {
  const { data } = await apiUsers.get<Usuario>(`/usuarios/${usuario_id}`);
  return data;
}

export async function createMetodoPago(
  usuario_id: string,
  payload: MetodoPagoCreate
): Promise<MetodoPago> {
  const { data } = await apiUsers.post<MetodoPago>(
    `/usuarios/${usuario_id}/metodos-pago/`,
    payload
  );
  return data;
}
