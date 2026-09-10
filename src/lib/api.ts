import axios from "axios";

type Service = "users" | "properties" | "reservations" | "dashboard" | "analytics";

const gateway = import.meta.env.VITE_API_GATEWAY_URL as string | undefined;

const envMap: Record<Service, string | undefined> = {
  users: import.meta.env.VITE_API_USERS_URL as string | undefined,
  properties: import.meta.env.VITE_API_PROPERTIES_URL as string | undefined,
  reservations: import.meta.env.VITE_API_RESERVATIONS_URL as string | undefined,
  dashboard: import.meta.env.VITE_API_DASHBOARD_URL as string | undefined,
  analytics: import.meta.env.VITE_API_ANALYTICS_URL as string | undefined,
};

function resolveBaseUrl(service: Service): string {
  if (gateway) {
    return `${gateway.replace(/\/$/, "")}/${service}`;
  }
  const local = envMap[service];
  if (local) return local.replace(/\/$/, "");
  // fallback to Vite proxy in dev
  return `/api/${service}`;
}

function createClient(service: Service) {
  const client = axios.create({
    baseURL: resolveBaseUrl(service),
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    (err) => {
      // Auto-logout ante 401 (token expirado o credenciales revocadas).
      // El backend aún no valida el token en todas las rutas, pero cuando
      // lo haga este manejo ya estará listo.
      if (err.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login?expired=1";
        }
      }
      if (!err.response) {
        // Sin respuesta: MS apagado, red caída o bloqueo CORS del navegador.
        // En dev deja VITE_API_*_URL vacías para usar el proxy /api/* (mismo origen).
        return Promise.reject(
          new Error("Sin respuesta del servidor: verifica que el microservicio esté levantado o usa el proxy /api/* en dev (CORS)")
        );
      }
      const msg = err.response?.data?.detail || err.message || "Error de red";
      return Promise.reject(new Error(msg));
    }
  );

  return client;
}

export const apiUsers = createClient("users");
export const apiProperties = createClient("properties");
export const apiReservations = createClient("reservations");
export const apiDashboard = createClient("dashboard");
export const apiAnalytics = createClient("analytics");

// helper to know if mock mode is on
export const isMock = import.meta.env.VITE_MOCK === "true";
