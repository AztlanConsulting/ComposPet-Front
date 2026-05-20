import { useState, useEffect } from 'react';
import { LogoutUseCase } from '../../../domain/useCases/logoutUseCase';

export const useLogout = () => {
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isLoading, setIsLoading] = useState(false);

    const logoutUseCase = new LogoutUseCase();

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