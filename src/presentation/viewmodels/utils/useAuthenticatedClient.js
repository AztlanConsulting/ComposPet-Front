import { useEffect, useState } from 'react';

import { ClientApiClient } from '../../../data/datasources/clientApiClient';
import { ClientRepository } from '../../../data/repositories/clientRepository';
import { GetClientUseCase } from '../../../domain/useCases/getClientUseCase';

/**
 * Hook reutilizable para obtener información básica del cliente asociado a un userId 
 * Incluyendo el cliente autentificado y su ruta asignada.

 *
 * @returns {{
 *  client: object|null,
 *  clientId: string|null,
 *  routeDay: string|null,
 *  loading: boolean,
 *  error: Error|null
 * }}
 * 
 */
function useAuthenticatedClient() {
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const userId = user?.id;

    useEffect(() => {
        const getAuthenticatedClient= async () => {
            if (!userId) {
                setError("No pudimos identificar tu sesión. Inicia sesión nuevamente.");
                setLoading(false);
                return;
            }
            try {

                setLoading(true);
                setError(null);

                const apiClient = new ClientApiClient();
                const clientRepository = new ClientRepository(apiClient);
                const getClientUseCase = new GetClientUseCase(clientRepository);

                //Ejecuta el getClientUsecase
                const clientEntity = await getClientUseCase.execute(userId);

                //Llega la entidad desde el repositorio y la guarda en el estado
                setClient(clientEntity);
            } catch (error) {
                console.error('Error al obtener el cliente autenticado:', error);

                setError("No pudimos cargar la información del cliente. Intenta nuevamente más tarde.");
            } finally {
                setLoading(false);
            }
        };

        getAuthenticatedClient();
    }, [userId]);

    // Usa el metodo de la entidad para sacar la info básica del clientId, si no existe pone null
    const clientId = client?.getClientId() || null;
    const routeDay = client?.getRouteDay() || null;

    // Le regresa el clientId a
    return {
        client,
        clientId,
        routeDay,
        loading,
        error,
    };
}

export default useAuthenticatedClient;