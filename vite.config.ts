import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
//
// NOTA: sin `server.proxy`. El proxy de Vite solo existe durante
// `npm run dev` y desaparece en el `dist/` estático que sirve Amplify,
// por eso la app dejó de interactuar en prod. Toda la comunicación va
// directa a VITE_API_URL (API Gateway HTTPS, con CORS habilitado),
// tanto en dev como en prod.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})
