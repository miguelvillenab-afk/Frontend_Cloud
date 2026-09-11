# CloudStay — Frontend (frontend-cloud)

SPA React + Vite + TypeScript para plataforma de alquiler de alojamientos (estilo Airbnb).
Desplegada en **AWS Amplify**, consume 5 microservicios vía **API Gateway HTTPS**.

> Docs de diseño: `docs/PLAN.md` (fases y endpoints) y `docs/STRUCTURE.md` (arquitectura detallada).

## Stack

- **React 19 + TypeScript + Vite 8** — build `tsc -b && vite build` → `dist/`
- **react-router-dom 7** — routing + `ProtectedRoute` por rol
- **axios** — cliente único con `baseURL = VITE_API_URL` (`src/lib/api.ts`)
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
│   ├── api.ts             # baseURL=VITE_API_URL + interceptores Bearer / auto-logout 401
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

Solo 2 variables (ver `.env.example`):

| Variable | Uso |
|---|---|
| `VITE_API_URL` | URL base del API Gateway HTTPS, ej. `https://xxxx.execute-api.us-east-1.amazonaws.com/prod`. Misma en dev y prod. Todos los recursos cuelgan de aquí: `/usuarios`, `/propiedades`, `/reservas`, `/dashboard`, `/analytics` |
| `VITE_MOCK` | `true` para forzar mocks (fallback si el backend no está levantado) |

> ⚠️ Vite inyecta el `.env` en build time: reinicia `npm run dev` tras cambiarlo, y en Amplify haz **nuevo build** tras cambiar una variable.

### Por qué no hay proxy

El `server.proxy` de Vite solo existe durante `npm run dev`. Amplify sirve el `dist/` estático ya compilado, donde ese proxy no existe — por eso la página cargaba pero no interactuaba. Ahora axios ataca `VITE_API_URL` directo en ambos entornos, y el CORS lo resuelve el API Gateway (debe permitir el origen de Amplify).

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

`amplify.yml`: `npm ci` → `npm run build` → artefacto `dist/`. En consola Amplify (Hosting → Variables de entorno) setear `VITE_API_URL` (+ `VITE_MOCK=false`) y redesplegar. El Gateway maneja CORS en prod.

## Estado y pendientes

- ✅ Infra (router, cliente api único, auth store, layout)
- ✅ Users + JWT (register/login/profile/pagos)
- ⬜ Fase 2: `useProperties` + catálogo real paginado (`page,limit`, 20k registros, debounce)
- ⬜ Fase 3-5: `useReservations`, `useDashboard`, `useAnalytics` + `recharts`
- ⬜ MSW handlers si `VITE_MOCK=true`, tests, `lint` limpio
