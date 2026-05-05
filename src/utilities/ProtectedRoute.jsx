import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../api/axiosConfig";

/**
 * Componente de ruta protegida que actúa como guardia de navegación.
 * Restringe el acceso a rutas basándose en el estado de autenticación
 * y en el rol del usuario autenticado.
 *
 * Si el usuario no está autenticado, redirige a `/inicio-sesion`.
 * Si el usuario está autenticado pero su rol no está incluido en los roles
 * permitidos, redirige a `/error`.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string[]} [props.roles] - Lista de roles con acceso permitido a las sub-rutas.
 * Si no se proporciona, cualquier usuario autenticado puede acceder.
 * @returns {JSX.Element} Renderiza las rutas hijas mediante `<Outlet />` si el usuario
 * es válido y tiene el rol requerido; de lo contrario, redirige según el caso.
 * @see isAuthenticated
 */
export default function ProtectedRoute({roles}) {

    const userRaw = sessionStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    const userRole = user?.rol;

    if (!isAuthenticated() && !user) {
        return <Navigate to="/inicio-sesion" replace />;
    }

    if (roles && !roles.includes(userRole)){
        return <Navigate to="/error" replace />;
    }

    return <Outlet />;
}

