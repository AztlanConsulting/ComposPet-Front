import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../api/axiosConfig";

/**
 * Componente de Ruta Protegida (Guarda de Navegación).
 * Restringe el acceso a sub-rutas basándose en el estado de autenticación.
 * * El componente verifica dos niveles de persistencia:
 * 1. El estado en memoria (vía `isAuthenticated()`).
 * 2. La existencia del objeto de usuario en `sessionStorage` (para persistencia en recargas).
 * * @returns {JSX.Element} Renderiza las rutas hijas mediante `<Outlet />` si el usuario es válido,
 * de lo contrario, redirige a la página de inicio de sesión.
 */
export default function ProtectedRoute() {
    /**
     * Recuperamos la información del usuario de sessionStorage.
     * Se usa como respaldo en caso de que el estado en memoria de axiosConfig
     * se haya limpiado tras un refresco de página (F5).
     */
    const user = sessionStorage.getItem("user");

    if (isAuthenticated() || user) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />;
}