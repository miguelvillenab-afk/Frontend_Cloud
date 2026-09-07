import { apiAnalytics } from "../lib/api";
import type { MetricaIngresos, MetricaOcupacion } from "./types";

export async function getOcupacion(params?: { desde?: string; hasta?: string }): Promise<MetricaOcupacion[]> {
  const { data } = await apiAnalytics.get<MetricaOcupacion[]>("/analytics/ocupacion", { params });
  return data;
}

export async function getIngresos(params?: { agrupacion?: string }): Promise<MetricaIngresos[]> {
  const { data } = await apiAnalytics.get<MetricaIngresos[]>("/analytics/ingresos", { params });
  return data;
}

export async function getTopPropiedades(limit = 10): Promise<{ propiedad_id: string; reservas: number }[]> {
  const { data } = await apiAnalytics.get("/analytics/top-propiedades", { params: { limit } });
  return data;
}
