import axios from "axios";

// Base única del backend (API Gateway). Se inyecta en build time vía
// VITE_API_URL, por lo que funciona igual en `npm run dev` y en el
// `dist/` estático que sirve Amplify (donde NO existe el proxy de Vite).
const baseURL = ((import.meta.env.VITE_API_URL as string | undefined) ?? "").replace(
  /\/$/,
  ""
);

if (!baseURL && typeof window !== "undefined") {
  console.warn(
    "[api] VITE_API_URL no está definida: las peticiones irán al mismo origen y fallarán en Amplify. Defínela en .env (local) o en las variables de entorno de Amplify (prod)."
  );
}

function createClient() {
  const client = axios.create({
    baseURL,
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
        // Sin respuesta: Gateway caído, red caída o bloqueo CORS del navegador
        // (el API Gateway debe tener CORS habilitado para el origen de Amplify).
        return Promise.reject(
          new Error("Sin respuesta del servidor: verifica VITE_API_URL y que el API Gateway tenga CORS habilitado")
        );
      }
      const msg = err.response?.data?.detail || err.message || "Error de red";
      return Promise.reject(new Error(msg));
    }
  );

  return client;
}

// Cliente único: todos los microservicios cuelgan del mismo API Gateway
// (rutas /usuarios, /propiedades, /reservas, /dashboard, /analytics).
// Se mantienen los alias por compatibilidad con src/api/*.ts.
export const api = createClient();
export const apiUsers = api;
export const apiProperties = api;
export const apiReservations = api;
export const apiDashboard = api;
export const apiAnalytics = api;

// helper to know if mock mode is on
export const isMock = import.meta.env.VITE_MOCK === "true";
