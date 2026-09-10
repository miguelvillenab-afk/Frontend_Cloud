# Plan Frontend — Plataforma de Alquiler de Alojamientos

> **Directorio:** `frontend-cloud/` | **Backend:** `Proyecto_Cloud/` (5 microservicios) | **Fecha:** 2026-09-05
> **Objetivo:** SPA React desplegada en AWS Amplify que consume vía API Gateway ≥2 métodos REST por microservicio (≥10 total).

## 1. Contexto verificado

- `frontend-cloud` parte de template Vite + React 19 + TS 6.0 (`package.json:1`, `vite.config.ts:5`, `src/App.tsx:1`) sin router ni cliente HTTP.
- Backend `Proyecto_Cloud/README.md:1` define 5 microservicios. Solo `user_microservice/app/main.py:16` está implementado (3 endpoints). Los otros 4 directorios (`properties_microservice`, `reservations_microservice`, `dashboard_microservice`, `analytics_microservice`) solo contienen `Dockerfile` vacío en ramas `origin/ms-*` (verificado con `git ls-tree -r origin/ms-properties`).
- Requisito trazador: consumo vía **API Gateway HTTPS** y deploy **Amplify**, con Swagger por servicio y 20k registros de prueba.

**Decisión:** diseñar contract-first. El frontend define contratos esperados para los 4 MS no implementados y usa mocks/interceptores hasta que expongan Swagger real. Para `user_microservice` se integra directo contra `http://localhost:8000/docs` en dev.

## 2. Stack Fase 0

Mantener Vite. Añadir:

| Paquete | Uso |
|---|---|
| `react-router-dom` | Routing SPA + ProtectedRoute por rol |
| `axios` | Cliente HTTP centralizado |
| `@tanstack/react-query` | Cache, paginación, retries |
| `zustand` | Estado sesión (`id_usuario`, `rol`, `nombre`) |
| `react-hook-form` + `zod` | Formularios + validación |
| `msw` (opcional dev) | Mocks si MS no está levantado |

No se introduce UI framework pesado en Fase 0; se usa `src/index.css` + CSS Modules / Tailwind posterior si se aprueba.

## 3. Configuración y API Gateway

```env
# .env.example
VITE_API_GATEWAY_URL=https://xxxx.execute-api.us-east-1.amazonaws.com/prod
VITE_API_USERS_URL=http://localhost:8000          # override dev
VITE_API_PROPERTIES_URL=http://localhost:8001
VITE_API_RESERVATIONS_URL=http://localhost:8002
VITE_API_DASHBOARD_URL=http://localhost:8003
VITE_API_ANALYTICS_URL=http://localhost:8004
VITE_MOCK=false
```

`src/lib/api.ts` exporta `apiUsers`, `apiProperties`, etc. creados con `axios.create({ baseURL })`. Si `VITE_API_GATEWAY_URL` está seteado, se usa `${GATEWAY}/users` etc.; si no, fallback a URLs locales. Interceptor añade `Authorization` cuando exista JWT. `vite.config.ts:5` añade `server.proxy` para evitar CORS en dev (`/api/users -> localhost:8000`).

## 4. Mapeo endpoints → UI

### 4.1 Users — `user_microservice` (4 endpoints, con JWT)

| Método | Ruta | Uso UI |
|---|---|---|
| `POST /usuarios/` | `UsuarioCreate{nombre,email,password,rol}` → `200 OK` (no 201) | Registro (HUESPED/ANFITRION) + auto-login |
| `GET /usuarios/{usuario_id}` | `UsuarioResponse` (+ `metodos_pago`) | Perfil / hidratación tras login |
| `POST /usuarios/{usuario_id}/metodos-pago/` | `MetodoPagoCreate` | Onboarding pago |
| `POST /login/` | `UsuarioLogin{email,password}` → `{access_token, token_type, usuario_id, rol}` | Login email+password (JWT HS256, `exp` = +60 min default) |

> Auth JWT: `POST /login/` verifica bcrypt y firma `{sub:id_usuario, rol, exp}`. `401` si falla. Frontend guarda `user+token` en `zustand`+`localStorage`, envía `Authorization: Bearer` en cada request y hace auto-logout a `/login?expired=1` ante `401`/expiración. Ningún endpoint del MS valida el token todavía (pendiente en backend). Los 20k usuarios fake usan hash `sha256` simulado y **no pueden loguear** — solo los creados vía API.

### 4.2 Properties — Spring Boot + MySQL (propuesto, contract-first)

```
GET    /propiedades?ciudad=&capacidad=&precio_min=&precio_max=&page=&limit=
GET    /propiedades/{id}
POST   /propiedades              # ANFITRION
PUT    /propiedades/{id}
DELETE /propiedades/{id}
```

UI: Catálogo con filtros + paginación (20k), Detalle, Publicar/Editar. Al menos 2 métodos: `GET /propiedades` y `POST /propiedades`.

### 4.3 Reservations — Node.js + MongoDB (propuesto)

```
POST /reservas                    # {id_usuario, id_propiedad, fecha_inicio, fecha_fin}
GET  /reservas?usuario_id=&propiedad_id=
GET  /reservas/{id}
POST /reservas/{id}/valoracion   # {puntaje, comentario}
```

UI: Crear reserva (HUESPED), Mis Reservas, Valoración. 2 métodos: `POST /reservas` y `GET /reservas`.

### 4.4 Dashboard — agregador sin BD

```
GET /dashboard/resumen/{usuario_id}      # consolida users+properties+reservations
GET /dashboard/propiedad/{id}/detalle    # propiedad + reservas + anfitrión
```

UI: Dashboard Anfitrión (mis propiedades + reservas) y Huésped (mis viajes). 2 métodos.

### 4.5 Analytics — Python + Athena (boto3)

```
GET /analytics/ocupacion?desde=&hasta=
GET /analytics/ingresos?agrupacion=mensual
GET /analytics/top-propiedades?limit=10
```

UI: Panel Analytics con `recharts` (bar/line). 2 métodos.

Total: 3+2+2+2+2 = 11 métodos REST, cumple requisito Amplify/Gateway.

## 5. Arquitectura de carpetas

```
src/
  lib/
    api.ts              # axios instances + gateway resolver
    queryClient.ts      # tanstack config
  api/
    users.ts            # POST /usuarios/, GET /usuarios/:id, POST .../metodos-pago, POST /login/
    properties.ts       # CRUD + search
    reservations.ts
    dashboard.ts
    analytics.ts
    types.ts            # DTOs compartidos (Usuario, Propiedad, Reserva...)
  stores/
    authStore.ts        # zustand: user, token, login(user,token)/logout, isTokenExpired
  hooks/
    useUsers.ts (useUser, useCreateUser, useLogin, useCreateMetodoPago), useProperties.ts ...
  routes/
    index.tsx           # createBrowserRouter + ProtectedRoute
    ProtectedRoute.tsx
  pages/
    Catalog.tsx
    PropertyDetail.tsx
    Auth/
      Login.tsx
      Register.tsx
    Profile.tsx
    PublishProperty.tsx
    Reservations.tsx
    Dashboard.tsx
    Analytics.tsx
  components/
    layout/Navbar.tsx, Layout.tsx
    common/Pagination.tsx, Filters.tsx, Card.tsx
  mocks/
    handlers.ts         # MSW si VITE_MOCK=true
```

Router:

```
/                 -> Catalog (GET /propiedades)
/propiedad/:id    -> PropertyDetail (GET /propiedades/:id + dashboard detalle)
/login             -> Auth/Login (POST /login/ + GET /usuarios/:id hidrata perfil)
/registro         -> Auth/Register (POST /usuarios/ + auto-login)
/perfil           -> Profile (GET /usuarios/:id + métodos pago)
/publicar         -> PublishProperty (POST /propiedades) [ANFITRION]
/mis-reservas     -> Reservations (GET /reservas?usuario_id=)
/dashboard        -> Dashboard (GET /dashboard/resumen/:id)
/analytics        -> Analytics (GET /analytics/*)
```

## 6. Flujos por rol

- **HUESPED:** Registro (`POST /usuarios/`) → Catálogo (`GET /propiedades`) → Detalle → Reservar (`POST /reservas`) → Mis Reservas (`GET /reservas`) → Valorar → Ver Analytics.
- **ANFITRION:** Registro rol ANFITRION → Publicar (`POST /propiedades`) → Dashboard (`GET /dashboard/resumen/:id` ve reservas de mis propiedades) → Analytics ingresos/ocupación.

## 7. Fases de implementación

| Fase | Entregable | Criterio done |
|---|---|---|
| **0** | Infra: router, api.ts, .env, proxy, stores, layout, MSW | `npm run dev` ok, `npm run build` ok, al menos 1 call mock a users |
| **1** | Users + JWT: Register (auto-login), Login email+pass, Profile, Métodos pago | 4 endpoints users integrados, token en localStorage, auto-logout 401/expiración |
| **2** | Properties: Catalog + filters + pagination, Detail, Publish/Edit | `GET /propiedades` paginado (20k), CRUD ANFITRION |
| **3** | Reservations: Crear, listar, valorar | `POST /reservas` + `GET /reservas` funcionando |
| **4** | Dashboard: agregador | 2 endpoints dashboard renderizando datos consolidados |
| **5** | Analytics: charts | 2 endpoints analytics con recharts |
| **6** | Amplify: `amplify.yml`, envs, HTTPS Gateway, Swagger links | Build Amplify verde, ≥10 calls visibles en Network |

## 8. Manejo de 20k registros y errores

- Paginación server-side (`page`, `limit=12/24`), `useInfiniteQuery` opcional, skeleton loaders.
- Filtros con debounce (ciudad, capacidad, precio). `queryKey` incluye filtros.
- Errores: `400 email ya registrado`, `404 usuario no encontrado`, `401 correo o contraseña incorrectos` (login) mapeados a mensajes humanos. Ante `401`/expiración (60 min default): auto-logout a `/login?expired=1`. Fallback UI si MS caído.
- CORS: en dev deja `VITE_API_*_URL` vacías para usar el proxy Vite (`/api/users → localhost:8000`, mismo origen, sin preflight). URLs absolutas (`http://localhost:8000`) solo funcionan si el FastAPI tiene `CORSMiddleware`; sin él el navegador bloquea y el preflight devuelve `405`. En prod el Gateway maneja CORS.
- ⚠️ Vite lee `.env` al arrancar: tras cambiarlo, reinicia `npm run dev`.

## 9. Deploy AWS Amplify

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild: { commands: ["npm ci"] }
    build: { commands: ["npm run build"] }
  artifacts: { baseDirectory: dist, files: ["**/*"] }
  cache: { paths: ["node_modules/**/*"] }
```

En consola Amplify setear `VITE_API_GATEWAY_URL` y overrides. Build verifica `tsc -b && vite build` (`package.json:8`).

## 10. Riesgos y decisiones abiertas

- Contratos de 4 MS no implementados pueden cambiar al ver Swagger real → aislar en `src/api/*.ts` para ajuste rápido. **Preguntar al dueño del MS** antes de cada fase.
- El MS aún no valida el JWT en sus rutas; el frontend ya lo envía, sin cambios cuando lo exijan.
- Login solo funciona con usuarios creados vía API (los 20k fake usan `sha256` simulado, no bcrypt).
- Si no hay Gateway aún, frontend funciona con URLs locales y `VITE_MOCK`.

## 11. Estado (Fase 0 + 1 users/JWT hechos)

1. ✅ Infra `src/lib/api.ts` (Bearer + auto-logout 401), `src/api/users.ts` (4 endpoints) + stubs resto.
2. ✅ `vite.config.ts` proxy y `.env.example`.
3. ✅ `stores/authStore.ts` (user+token), `routes/index.tsx`, `components/layout`.
4. ✅ Login email+password, Register con auto-login, Profile + pagos, `ProtectedRoute` con expiración.
5. Siguiente: Fase 2 Properties al tener Swagger real.

> Cualquier duda sobre el microservicio (contrato, puerto, Swagger) se consulta al responsable antes de integrar.
