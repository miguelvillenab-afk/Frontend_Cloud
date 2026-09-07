import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { Catalog } from "../pages/Catalog";
import { PropertyDetail } from "../pages/PropertyDetail";
import { Register } from "../pages/Auth/Register";
import { Login } from "../pages/Auth/Login";
import { Profile } from "../pages/Profile";
import { PublishProperty } from "../pages/PublishProperty";
import { Reservations } from "../pages/Reservations";
import { Dashboard } from "../pages/Dashboard";
import { Analytics } from "../pages/Analytics";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Catalog /> },
      { path: "/propiedad/:id", element: <PropertyDetail /> },
      { path: "/registro", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/perfil", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "/publicar", element: <ProtectedRoute roles={["ANFITRION"]}><PublishProperty /></ProtectedRoute> },
      { path: "/mis-reservas", element: <ProtectedRoute><Reservations /></ProtectedRoute> },
      { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: "/analytics", element: <Analytics /> },
    ],
  },
]);
