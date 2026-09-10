# CloudStay — Frontend (frontend-cloud)

SPA React + Vite + TypeScript para plataforma de alquiler de alojamientos (estilo Airbnb).
Desplegada en **AWS Amplify**, consume 5 microservicios vía **API Gateway HTTPS**.

> Docs de diseño: `docs/PLAN.md` (fases y endpoints) y `docs/STRUCTURE.md` (arquitectura detallada).

## Stack

- **React 19 + TypeScript + Vite 8** — build `tsc -b && vite build` → `dist/`
- **react-router-dom 7** — routing + `ProtectedRoute` por rol
- **axios** — 5 clientes HTTP (`src/lib/api.ts`)
- **@tanstack/react-query** — cache (`retry:1`, `staleTime:2min`)
- **zustand** — sesión (`user`, `token` en `localStorage`)
- **react-hook-form + zod** — formularios con validación
- CSS propio en `src/index.css` (tokens `--brand:#ff385c`, layout responsive, sin UI framework pesado)
- `lucide-react` — iconos

## Estructura

```
src/
├── main.tsx               # QueryClientProvider + RouterProvider (sin App.tsx)
├── index.css              # Design system global
├── lib/
│   ├── api.ts             # resolveBaseUrl + interceptores Bearer / auto-logout 401
│   └── queryClient.ts     # config TanStack Query
├── api/
│   ├── types.ts           # DTOs: Usuario, Propiedad, Reserva, Dashboard…
│   ├── users.ts           # REAL: POST/GET /usuarios, POST /metodos-pago, POST /login/
│   ├── properties.ts      # contract-first: CRUD /propiedades
│   ├── reservations.ts    # contract-first: /reservas + valoración
│   ├── dashboard.ts       # contract-first: /dashboard/resumen, /detalle
│   └── analytics.ts       # contract-first: /analytics/*
├── stores/authStore.ts    # login(user,token)/logout, isTokenExpired
├── hooks/useUsers.ts      # useUser, useCreateUser, useLogin, useCreateMetodoPago
├── mocks/properties.ts    # 8 listings fallback hasta Swagger real
├── routes/
│   ├── index.tsx          # createBrowserRouter, 9 rutas bajo <Layout/>
│   └── ProtectedRoute.tsx # guard auth + roles + expiración → /login?expired=1
├── components/
│   ├── layout/Navbar.tsx, Layout.tsx
│   └── common/PropertyCard.tsx, StatCard.tsx
└── pages/
    ├── Catalog.tsx            # / — hero + filtros + grid
    ├── PropertyDetail.tsx     # /propiedad/:id — gallery + booking sticky
    ├── Auth/Login.tsx         # /login — POST /login/ + hidrata GET /usuarios/:id
    ├── Auth/Register.tsx      # /registro — POST /usuarios/ + auto-login
    ├── Profile.tsx            # /perfil — perfil + métodos de pago
    ├── PublishProperty.tsx    # /publicar [ANFITRION]
    ├── Reservations.tsx       # /mis-reservas
    ├── Dashboard.tsx          # /dashboard
    └── Analytics.tsx          # /analytics
```

## Rutas

| Ruta | Acceso | Backend |
|---|---|---|
| `/` | pública | `GET /propiedades` (hoy mock local) |
| `/propiedad/:id` | pública | `GET /propiedades/:id` |
| `/registro` | pública | `POST /usuarios/` → auto-login |
| `/login` | pública | `POST /login/` + `GET /usuarios/:id` |
| `/perfil` | auth | `GET /usuarios/:id`, `POST .../metodos-pago/` |
| `/publicar` | `ANFITRION` | `POST /propiedades` (futuro) |
| `/mis-reservas` | auth | `GET /reservas?usuario_id` (futuro) |
| `/dashboard` | auth | `GET /dashboard/resumen/:id` (futuro) |
| `/analytics` | pública | `GET /analytics/*` (futuro) |

Roles: `HUESPED | ANFITRION`. JWT HS256 `exp` +60 min; ante `401`/expiración hay auto-logout a `/login?expired=1`.

## Configuración (.env)

```bash
cp .env.example .env
```

| Variable | Uso |
|---|---|
| `VITE_API_GATEWAY_URL` | Prod: `https://xxxx.execute-api.us-east-1.amazonaws.com/prod` → `${gateway}/${service}` |
| `VITE_API_USERS_URL` … `VITE_API_ANALYTICS_URL` | Override dev (ej. `http://localhost:8000`). **Vacías = usa proxy Vite** |
| `VITE_MOCK` | `true` para forzar mocks |

Resolución en `src/lib/api.ts:15`: Gateway → URL local → fallback `/api/*` (proxy).

> ⚠️ Vite lee `.env` al arrancar: reinicia `npm run dev` tras cambiarlo.

### Proxy dev (sin CORS)

`vite.config.ts` mapea mismo-origen → microservicios:

```
/api/users → :8000 | /api/properties → :8001 | /api/reservations → :3000
/api/dashboard → :8003 | /api/analytics → :8004
```

Deja las `VITE_API_*_URL` vacías en dev para evitar preflight/CORS. URLs absolutas solo funcionan si el FastAPI tiene `CORSMiddleware`.

## Desarrollo

```bash
npm ci
npm run dev      # :5173
npm run build    # tsc -b && vite build
npm run lint
npm run preview
```

Flujos verificados (Fase 0 + 1):

1. **Registro:** `/registro` → `POST /usuarios/` (responde `200`, no `201`) → `POST /login/` → `GET /usuarios/:id` → `/perfil`. Si el auto-login falla, cae a `/login`.
2. **Login:** email+password → `POST /login/` → hidrata perfil → `/perfil`.
3. **Pagos:** `/perfil` → `POST /usuarios/:id/metodos-pago/`.

Notas: solo loguean usuarios creados vía API (los 20k fake usan hash `sha256` simulado, no bcrypt → `401`). `400 email ya registrado`, `404 usuario no encontrado`, `401 credenciales incorrectas` se mapean a mensajes humanos.

## Deploy AWS Amplify

`amplify.yml`: `npm ci` → `npm run build` → artefacto `dist/`. En consola Amplify setear `VITE_API_GATEWAY_URL` (HTTPS requerido). El Gateway maneja CORS en prod.

## Estado y pendientes

- ✅ Infra (router, api multi-servicio, proxy, auth store, layout)
- ✅ Users + JWT (register/login/profile/pagos)
- ⬜ Fase 2: `useProperties` + catálogo real paginado (`page,limit`, 20k registros, debounce)
- ⬜ Fase 3-5: `useReservations`, `useDashboard`, `useAnalytics` + `recharts`
- ⬜ MSW handlers si `VITE_MOCK=true`, tests, `lint` limpio
