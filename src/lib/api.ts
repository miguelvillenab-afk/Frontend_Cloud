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
