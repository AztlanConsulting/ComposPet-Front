import { useState } from 'react';
import { LogoutUseCase } from '../../../domain/useCases/logoutUseCase';
import ProblemAlert from '../../../components/Template/ProblemAlert'; 

/**
 * Custom Hook encargado de gestionar el estado de la sesión del usuario y el flujo de cierre de sesión.
 * Conecta la lógica del caso de uso de Dominio con los componentes de la interfaz de usuario (React).
 *
 * @category Hooks
 * @returns {{
 * user: object|null,
 * isAdmin: boolean,
 * logout: function(): Promise<void>,
 * isLoading: boolean
 * }} Un objeto que contiene el estado del usuario, bandera de rol, la función de logout y el estado de carga.
 */
export const useLogout = (useCaseOverride = null) => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isLoading, setIsLoading] = useState(false);

    const logoutUseCase = useCaseOverride ?? new LogoutUseCase();

    /**
     * Orquesta el proceso de cierre de sesión. Intercepta la UI para activar el estado de carga,
     * ejecuta el caso de uso del dominio, limpia el almacenamiento local y reinicia los estados.
     * En caso de fallo, registra el error y despliega una alerta visual para el usuario.
     *
     * @async
     * @function logout
     * @returns {Promise<void>}
     */
    const logout = async () => {
        setIsLoading(true);
        try {
            await logoutUseCase.execute();
            
            // Limpieza de estado local
            setUser(null);
            sessionStorage.removeItem('user');
            window.location.href = '/inicio-sesion';
        } catch (error) {
            console.error("Error en logout:", error);
            
            // Muestra la alerta visual usando tu componente personalizado
            await ProblemAlert({
                title: "Error al cerrar sesión",
                text: error.message || "No se pudo finalizar la sesión. Inténtalo de nuevo.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        isAdmin: user?.rol === 'Administrador',
        logout,
        isLoading
    }
}