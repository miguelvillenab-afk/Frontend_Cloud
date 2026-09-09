# Estructura del Frontend — CloudStay (frontend-cloud)

> SPA React + Vite + TypeScript. Desplegada en **AWS Amplify**, consume 5 microservicios vía **API Gateway HTTPS**. Estilo Airbnb con design system propio en `src/index.css`.

## 1. Árbol general

```
frontend-cloud/
├── amplify.yml              # Build Amplify: npm ci → npm run build → dist/
├── vite.config.ts           # Vite + proxy dev /api/* → localhost:800X
├── index.html               # Entry HTML
├── .env / .env.example      # URLs Gateway + overrides locales + VITE_MOCK
├── package.json             # Scripts dev/build/lint/preview + deps
├── tsconfig.app.json        # TS strict (noUnusedLocals, etc.)
├── public/                  # Estáticos
├── docs/
│   ├── PLAN.md              # Plan por fases, endpoints, deploy
│   └── STRUCTURE.md         # Este archivo
└── src/
    ├── main.tsx             # Bootstrap: Router + React Query
    ├── index.css            # Design system global (tokens, layout, responsive)
    ├── lib/
    │   ├── api.ts           # Axios multi-servicio + Gateway resolver
    │   └── queryClient.ts   # TanStack Query config
    ├── api/
    │   ├── types.ts         # DTOs compartidos (Usuario, Propiedad, Reserva…)
    │   ├── users.ts         # REAL: POST/GET usuarios, POST métodos-pago
    │   ├── properties.ts    # Contract-first: CRUD /propiedades
    │   ├── reservations.ts  # Contract-first: /reservas + valoración
    │   ├── dashboard.ts     # Contract-first: /dashboard/resumen, /detalle
    │   └── analytics.ts     # Contract-first: /analytics/*
    ├── stores/
    │   └── authStore.ts     # Zustand: user, rol, login/logout, localStorage
    ├── hooks/
    │   └── useUsers.ts      # useUser, useCreateUser, useCreateMetodoPago
    ├── mocks/
    │   └── properties.ts    # 8 listings mock + CATEGORIES (hasta Swagger real)
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx   # Sticky blur, logo, NavLinks, pill-user + rol
    │   │   └── Layout.tsx   # <Outlet/> + footer 4 columnas + Swagger links
    │   └── common/
    │       ├── PropertyCard.tsx  # Card Airbnb: img, heart, price-tag, rating
    │       ├── StatCard.tsx      # KPI con acento lateral
    │       └── ServiceStatus.tsx # Dots verde/ámbar por microservicio
    ├── routes/
    │   ├── index.tsx           # createBrowserRouter + Layout + 9 rutas
    │   └── ProtectedRoute.tsx  # Guard auth + roles
    └── pages/
        ├── Catalog.tsx         # Hero + search + filtros + grid
        ├── PropertyDetail.tsx  # Gallery + amenities + booking sticky
        ├── Auth/
        │   ├── Register.tsx    # Split + role-toggle + POST /usuarios/
        │   └── Login.tsx       # Split + login UUID vía GET /usuarios/:id
        ├── Profile.tsx         # Perfil live + tarjetas + JSON MS
        ├── PublishProperty.tsx # Form ANFITRION + tips
        ├── Reservations.tsx    # Stats + tabla viajes + valorar
        ├── Dashboard.tsx       # KPIs + barras ocupación + top props
        └── Analytics.tsx       # KPIs + barras ingresos + top tabla
```

## 2. Configuración y bootstrap

| Archivo | Responsabilidad |
|---|---|
| `src/main.tsx:1` | `createRoot` → `QueryClientProvider(queryClient)` → `RouterProvider(router)`. Sin `App.tsx` legacy (eliminado). |
| `vite.config.ts:5` | `server.port 5173` + `proxy`: `/api/users→:8000`, `/properties→:8001`, `/reservations→:8002`, `/dashboard→:8003`, `/analytics→:8004`. Evita CORS en dev. |
| `src/lib/api.ts:1` | `resolveBaseUrl(service)`: si `VITE_API_GATEWAY_URL` existe → `${gateway}/${service}` (prod HTTPS); si no, `VITE_API_*_URL` o fallback `/api/*`. Interceptor añade `Authorization: Bearer <token>` y normaliza error a `err.response.data.detail`. Exporta `apiUsers`, `apiProperties`, `apiReservations`, `apiDashboard`, `apiAnalytics` + `isMock`. |
| `src/lib/queryClient.ts:1` | `retry:1`, `refetchOnWindowFocus:false`, `staleTime:2min`. |
| `.env.example:1` | `VITE_API_GATEWAY_URL` + 5 overrides locales + `VITE_MOCK`. `.env` ignorado en `.gitignore:14`. |
| `amplify.yml:1` | `npm ci` → `npm run build` (`tsc -b && vite build`) → artefacto `dist/`. Env vars se setean en consola Amplify. |

## 3. Capa de datos (`src/api/`)

### `types.ts:1` — DTOs
- `Rol = HUESPED | ANFITRION` (igual que `user_microservice/app/schemas.py:22`).
- `Usuario{id_usuario, nombre, email, rol, fecha_registro, metodos_pago[]}`, `UsuarioCreate`, `MetodoPago`, `MetodoPagoCreate`.
- `Propiedad{id, id_anfitrion, titulo, descripcion, ciudad, direccion, capacidad, precio_noche, imagen_url?, created_at}` + `Paginated<T>`.
- `Reserva{id, id_usuario, id_propiedad, fecha_inicio, fecha_fin, estado, puntaje?, comentario?}`.
- `DashboardResumen`, `MetricaOcupacion`, `MetricaIngresos`.

### `users.ts:1` — ÚNICO REAL (FastAPI :8000)
- `createUser(payload) → POST /usuarios/` — `main.py:16`, 400 si email existe.
- `getUser(id) → GET /usuarios/{id}` — `main.py:23`, 404 si no existe.
- `createMetodoPago(id, payload) → POST /usuarios/{id}/metodos-pago/` — `main.py:30`.

### `properties.ts:1`, `reservations.ts:1`, `dashboard.ts:1`, `analytics.ts:1` — Contract-first
Definidos para cumplir ≥2 métodos REST por MS cuando el Swagger exista. Hoy la UI usa `src/mocks/properties.ts:1` como fallback. Cambiar solo `baseURL`/`types` al tener backend real, sin tocar páginas.

| MS | Endpoints propuestos |
|---|---|
| Properties (Spring+MySQL) | `GET /propiedades?ciudad&capacidad&precio&page&limit`, `GET /propiedades/:id`, `POST /propiedades`, `PUT /propiedades/:id`, `DELETE /propiedades/:id` |
| Reservations (Node+Mongo) | `POST /reservas`, `GET /reservas?usuario_id`, `GET /reservas/:id`, `POST /reservas/:id/valoracion` |
| Dashboard (agregador) | `GET /dashboard/resumen/:usuario_id`, `GET /dashboard/propiedad/:id/detalle` |
| Analytics (Athena/boto3) | `GET /analytics/ocupacion`, `GET /analytics/ingresos`, `GET /analytics/top-propiedades` |

## 4. Estado y hooks

- `src/stores/authStore.ts:1` — Zustand `useAuthStore{user, isAuthenticated, login, logout, setUser}`. Persiste `user` + `userId` en `localStorage`. Sin JWT aún (MS solo bcrypt); `token` se lee en `lib/api.ts:32` cuando exista. `getCurrentRol()` helper.
- `src/hooks/useUsers.ts:1` — TanStack: `useUser(id)` (enabled si hay id), `useCreateUser()`, `useCreateMetodoPago()`. Fases 2-5 añadirán `useProperties`, `useReservations`, etc. con mismo patrón.

## 5. Routing (`src/routes/`)

`src/routes/index.tsx:14` — `createBrowserRouter` bajo `<Layout/>`:

| Ruta | Página | Guard | API que usará |
|---|---|---|---|
| `/` | `Catalog` | pública | `GET /propiedades` |
| `/propiedad/:id` | `PropertyDetail` | pública | `GET /propiedades/:id` + dashboard detalle |
| `/registro` | `Auth/Register` | pública | `POST /usuarios/` |
| `/login` | `Auth/Login` | pública | `GET /usuarios/:id` |
| `/perfil` | `Profile` | `ProtectedRoute` | `GET /usuarios/:id` + métodos pago |
| `/publicar` | `PublishProperty` | `ProtectedRoute roles=[ANFITRION]` | `POST /propiedades` |
| `/mis-reservas` | `Reservations` | `ProtectedRoute` | `GET /reservas?usuario_id` |
| `/dashboard` | `Dashboard` | `ProtectedRoute` | `GET /dashboard/resumen/:id` |
| `/analytics` | `Analytics` | pública | `GET /analytics/*` |

`ProtectedRoute.tsx:1` — si `!isAuthenticated` → `/login`; si `roles` y `user.rol` no incluido → `/`.

## 6. UI / Componentes

### Design system — `src/index.css:1` (273 líneas)
Tokens: `--brand:#ff385c`, `--ink:#1a1d23`, `--muted`, `--line`, `--surface`, `--radius:16px/24px`, `--shadow-sm/shadow/shadow-lg`. Clases: `.container/.page`, `.nav-wrap/.nav/.logo/.pill-user/.role-badge`, `.btn-primary/.btn-brand/.btn-ghost`, `.input/.field/.err`, `.hero/.hero-card/.hero-stats`, `.searchbar/.cats/.cat`, `.grid/.card/.card-img/.price-tag`, `.auth-wrap/.auth-side/.auth-form/.role-toggle`, `.gallery/.detail-grid/.panel/.booking`, `.stats/.stat/.table/.status-*`, `.bars/.bar`, `.svc/.dot-ok/.dot-pending`, `.footer`, `.profile-grid/.json`. Responsive `@1020px` (3col→1col, nav-links oculto) y `@640px` (grid 2col, search 1col).

### Layout
- `Navbar.tsx:1` — sticky + blur, logo `⌂ CloudStay`, `NavLink` con `.active`, derecha: `Entrar`/`Regístrate` o `pill-user` (badge rol + nombre + avatar) + `Salir`.
- `Layout.tsx:1` — `<Navbar/>` + `<main class="container page"><Outlet/></main>` + footer 4 col (Explorar / Anfitriones / Swagger :8000-:8002) + bottom `© 2026`.

### Comunes
- `PropertyCard.tsx:1` — props `{id,titulo,ciudad,precio_noche,imagen_url,rating,reviews,capacidad,tag}` → `<Link class="card">` con `.card-img>img+heart+price-tag`, `.card-body` (loc+rating, sub, price).
- `StatCard.tsx:1` — `{label,value,sub,color}` → `.stat` con `--accent` lateral.
- `ServiceStatus.tsx:1` — lista fija 5 MS con `.dot-ok` (users) / `.dot-pending` (resto mock).

### Mocks
- `mocks/properties.ts:1` — `MOCK_PROPERTIES[8]` (Lima/Cusco/Urubamba/Paracas/Arequipa/Iquitos, Unsplash `?w=800&q=80`, `rating/reviews/tag`) + `CATEGORIES[8]`.

## 7. Páginas (qué renderiza cada una)

- `Catalog.tsx:1` — `hero` (badges Amplify/5MS/20k + CTA registro/analytics + card 3 pasos), `.searchbar` (q, maxPrice, cat) con `useMemo` filter (incluye reglas Lujo/Eco/Playa), `ServiceStatus`, `.cats`, `section-title` con conteo, `.grid>PropertyCard`, empty `.panel`.
- `PropertyDetail.tsx:1` — back btn, título/rating/dir, `.gallery[3]`, `.detail-grid`: izq `.panel` descripción + `.amenities[6]` + reseñas mock + nota `POST /valoracion`; der `.panel.booking` sticky (precio, dates, kv total = precio*3+12, CTA → `/mis-reservas`).
- `Auth/Register.tsx:1` — `.auth-wrap`: `.auth-side` (roles + live API) + `.auth-form` con `role-toggle` (`setValue`), `react-hook-form+zod` (`nombre/email/password/rol`), `useCreateUser→login→/perfil`, `.api-note POST /usuarios/`.
- `Auth/Login.tsx:1` — mismo split; input UUID → `getUser→login→/perfil`; nota `GET /usuarios/{id}` + link Swagger.
- `Profile.tsx:1` — `useUser(user.id)`; `section-title` + badge; `.profile-grid`: card avatar/nombre/email/fecha/ID + panel tarjetas (`map metodos_pago → .amen`) + form `tipo/last4 → useCreateMetodoPago → setUser+refetch` + panel `.json` live.
- `PublishProperty.tsx:1` — `.detail-grid`: form (título, ciudad/capacidad, precio, descripción, CTA) + tips panel (fotos, precio sugerido $68, Superhost).
- `Reservations.tsx:1` — 4 `StatCard` + `.panel>table.table` (3 rows mock con `status-*` + btn Valorar) + nota `POST /reservas`.
- `Dashboard.tsx:1` — 4 `StatCard` (ingresos/ocupación/reservas/rating) + `.detail-grid`: `.bars[7]` ocupación + top props kv.
- `Analytics.tsx:1` — 4 `StatCard` (revenue/noches/ADR/ciudad) + `.bars[8]` ingresos + `table` top 4 + notas Athena.

## 8. Dependencias (`package.json:1`)

- `react ^19.2.8`, `react-dom`, `react-router-dom ^7.18.3` (routing), `axios ^1.20.0` (HTTP), `@tanstack/react-query ^5.102.8` (cache), `zustand ^5.0.15` (sesión), `react-hook-form ^7.87.0` + `zod ^4.5.4` + `@hookform/resolvers` (forms). Dev: `vite ^8.2.2`, `@vitejs/plugin-react ^6.1.0`, `typescript ~6.0.2`, `eslint`.
- Scripts: `dev` (vite :5173), `build` (`tsc -b && vite build` → 245 módulos, CSS 14.4kB, JS ~512kB), `lint`, `preview`.

## 9. Flujos clave

- **Registro HUESPED/ANFITRION:** `/registro` → `POST /usuarios/` → `authStore.login` (localStorage) → `/perfil` → `GET /usuarios/:id` revalida.
- **Login mock:** `/login` pega UUID (visto en Network tras registro) → `GET /usuarios/:id` → `/perfil`.
- **Pago:** `/perfil` form → `POST /usuarios/:id/metodos-pago/` → `setUser` + `refetch`.
- ** Exploración sin backend:** `/` filtra `MOCK_PROPERTIES` local; al llegar Swagger real, `listProperties()` reemplaza el `useMemo` sin cambiar UI.
- **ANFITRION:** `/publicar` (guard rol) → futuro `POST /propiedades`; `/dashboard` agrega `GET /dashboard/resumen/:id`.

## 10. Qué falta / próximos pasos

1. `hooks/useProperties.ts`, `useReservations.ts`, `useDashboard.ts`, `useAnalytics.ts` con `useQuery` paginado (`page,limit`, `keepPreviousData`).
2. Conectar `Catalog` a `listProperties()` real + `Pagination.tsx` + `Filters.tsx` (20k, debounce).
3. `POST /auth/login` con JWT en `user_microservice` para auth real (hoy UUID).
4. `recharts` para Analytics + `MSW handlers` si `VITE_MOCK=true`.
5. Tests + `npm run lint` limpio + deploy Amplify con `VITE_API_GATEWAY_URL`.
