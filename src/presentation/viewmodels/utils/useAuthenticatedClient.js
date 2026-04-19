import { useEffect, useState } from 'react';

import { ClientApiClient } from '../../../data/datasources/clientApiClient';
import { ClientRepository } from '../../../data/repositories/clientRepository';
import { GetClientUseCase } from '../../../domain/useCases/getClientUseCase';

/**
 * Hook reutilizable para obtener el cliente asociado
 * al usuario autenticado en sesión.
 *
 * @returns {{ client: object|null, idCliente: string|null }} Cliente autenticado e id del cliente.
 */
function useAuthenticatedClient() {
    const [client, setClient] = useState(null);

    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    const userId = user?.id;

    useEffect(() => {
        const getAuthenticatedClient= async () => {
            if (!userId) return;
            try {
                const apiClient = new ClientApiClient();
                const clientRepository = new ClientRepository(apiClient);
                const getClientUseCase = new GetClientUseCase(clientRepository);

                const clientEntity = await getClientUseCase.execute(userId);
                console.log("CLIENTE OBTENIDO EN EL HOOK", clientEntity);

                setClient(clientEntity);
            } catch (error) {
                console.error('Error al obtener el cliente autenticado:', error);
            }
        };

        if (userId) {
            getAuthenticatedClient();
        }
    }, [userId]);

    const clientId = client?.getClientId() || null;

    return {
        client,
        clientId,
    };
}

export default useAuthenticatedClient;