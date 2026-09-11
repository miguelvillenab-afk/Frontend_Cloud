import { apiUsers } from "../lib/api";
import type { LoginResponse, MetodoPago, MetodoPagoCreate, Usuario, UsuarioCreate, UsuarioLogin } from "./types";

// Endpoints reales: user_microservice (POST /usuarios/, GET /usuarios/{id},
// POST /usuarios/{id}/metodos-pago/, POST /login/). Nota: POST /usuarios/
// responde 200 OK (FastAPI default, sin status_code=201 explícito).
export async function createUser(payload: UsuarioCreate): Promise<Usuario> {
  const { data } = await apiUsers.post<Usuario>("/users/usuarios/", payload);
  return data;
}

export async function loginUser(payload: UsuarioLogin): Promise<LoginResponse> {
  const { data } = await apiUsers.post<LoginResponse>("/users/login/", payload);
  return data;
}

export async function getUser(usuario_id: string): Promise<Usuario> {
  const { data } = await apiUsers.get<Usuario>(`/users/usuarios/${usuario_id}`);
  return data;
}

export async function createMetodoPago(
  usuario_id: string,
  payload: MetodoPagoCreate
): Promise<MetodoPago> {
  const { data } = await apiUsers.post<MetodoPago>(
    `/users/usuarios/${usuario_id}/metodos-pago/`,
    payload
  );
  return data;
}
