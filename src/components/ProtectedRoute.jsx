import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../api/axiosConfig";

/**
 * Componente de ruta protegida que restringe el acceso a usuarios autenticados.
 * Verifica la existencia del token en `sessionStorage` antes de renderizar
 * el contenido. Si no hay token, redirige al login sin agregar la ruta
 * actual al historial de navegación.
 *
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - Componente o vista a renderizar si el usuario está autenticado.
 * @returns {JSX.Element} El contenido protegido o una redirección a `/login`.
 */
export default function ProtectedRoute() {
    const user = sessionStorage.getItem("user");

    if (isAuthenticated() || user) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />;
}