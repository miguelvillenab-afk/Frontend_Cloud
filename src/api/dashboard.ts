import { apiDashboard } from "../lib/api";
import type { DashboardResumen, Propiedad } from "./types";

export async function getDashboardResumen(usuario_id: string): Promise<DashboardResumen> {
  const { data } = await apiDashboard.get<DashboardResumen>(`/dashboard/resumen/${usuario_id}`);
  return data;
}

export async function getDashboardPropiedadDetalle(id: string): Promise<{
  propiedad: Propiedad;
  reservas: number;
  anfitrion: string;
}> {
  const { data } = await apiDashboard.get(`/dashboard/propiedad/${id}/detalle`);
  return data;
}
