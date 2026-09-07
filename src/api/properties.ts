import { apiProperties } from "../lib/api";
import type { Paginated, Propiedad } from "./types";

// Contratos propuestos - validar contra Swagger de properties_microservice
export interface PropertyFilters {
  ciudad?: string;
  capacidad?: number;
  precio_min?: number;
  precio_max?: number;
  page?: number;
  limit?: number;
}

export async function listProperties(
  filters: PropertyFilters = {}
): Promise<Paginated<Propiedad>> {
  const { data } = await apiProperties.get<Paginated<Propiedad>>("/propiedades", {
    params: filters,
  });
  return data;
}

export async function getProperty(id: string): Promise<Propiedad> {
  const { data } = await apiProperties.get<Propiedad>(`/propiedades/${id}`);
  return data;
}

export async function createProperty(
  payload: Omit<Propiedad, "id" | "created_at">
): Promise<Propiedad> {
  const { data } = await apiProperties.post<Propiedad>("/propiedades", payload);
  return data;
}

export async function updateProperty(
  id: string,
  payload: Partial<Propiedad>
): Promise<Propiedad> {
  const { data } = await apiProperties.put<Propiedad>(`/propiedades/${id}`, payload);
  return data;
}

export async function deleteProperty(id: string): Promise<void> {
  await apiProperties.delete(`/propiedades/${id}`);
}
