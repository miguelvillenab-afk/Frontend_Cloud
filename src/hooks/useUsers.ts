import { useMutation, useQuery } from "@tanstack/react-query";
import { createMetodoPago, createUser, getUser, loginUser } from "../api/users";
import type { MetodoPagoCreate, UsuarioCreate, UsuarioLogin } from "../api/types";

export function useUser(usuario_id: string | null) {
  return useQuery({
    queryKey: ["user", usuario_id],
    queryFn: () => getUser(usuario_id!),
    enabled: !!usuario_id,
  });
}

export function useCreateUser() {
  return useMutation({
    mutationFn: (payload: UsuarioCreate) => createUser(payload),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (payload: UsuarioLogin) => loginUser(payload),
  });
}

export function useCreateMetodoPago() {
  return useMutation({
    mutationFn: ({ usuario_id, payload }: { usuario_id: string; payload: MetodoPagoCreate }) =>
      createMetodoPago(usuario_id, payload),
  });
}
