import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
    isAuthenticated,
    refreshAccessToken,
    clearAccessToken,
} from "../api/axiosConfig";
import Loading from "../components/Template/loading";

/**
 * Componente de ruta protegida que actúa como guardia de navegación.
 *
 * Primero intenta validar/restaurar la sesión antes de renderizar las rutas hijas.
 * Esto evita que las vistas protegidas lancen peticiones sin accessToken.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string[]} [props.roles] - Lista de roles con acceso permitido.
 * @returns {JSX.Element}
 */
export default function ProtectedRoute({ roles }) {
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [hasValidSession, setHasValidSession] = useState(false);

    const userRaw = sessionStorage.getItem("user");

    let user = null;

    try {
        user = userRaw ? JSON.parse(userRaw) : null;
    } catch (error) {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("authProvider");
        user = null;
    }

    const userRole = user?.rol;

    useEffect(() => {
        let isMounted = true;

        const validateSession = async () => {
            try {
                if (isAuthenticated()) {
                    if (isMounted) {
                        setHasValidSession(true);
                    }
                    return;
                }

                if (!userRaw) {
                    if (isMounted) {
                        setHasValidSession(false);
                    }
                    return;
                }

                await refreshAccessToken();

                if (isMounted) {
                    setHasValidSession(true);
                }
            } catch (error) {
                clearAccessToken();
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("authProvider");

                if (isMounted) {
                    setHasValidSession(false);
                }
            } finally {
                if (isMounted) {
                    setIsCheckingSession(false);
                }
            }
        };

        validateSession();

        return () => {
            isMounted = false;
        };
    }, [userRaw]);

    if (isCheckingSession) {
        return <Loading />;
    }

    if (!hasValidSession) {
        return <Navigate to="/inicio-sesion" replace />;
    }

    if (roles && !roles.includes(userRole)) {
        return <Navigate to="/error" replace />;
    }

    return <Outlet />;
}