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

    //Obtener Token de id Usuario de sessionStorage
    const token = sessionStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;

    useEffect(() => {
        const getAuthenticatedClient= async () => {
            try {
                const apiClient = new ClientApiClient();
                const clientRepository = new ClientRepository(apiClient);
                const getClientUseCase = new GetClientUseCase(clientRepository);

                //Ejecuta el getClientUsecase
                const clientEntity = await getClientUseCase.execute(userId);

                //Llega la entidad desde el repositorio y la guarda en el estado
                setClient(clientEntity);
            } catch (error) {
                console.error('Error al obtener el cliente autenticado:', error);
            }
        };

        if (userId) {
            getAuthenticatedClient();
        }
    }, [userId]);

    // Usa el metodo de la entidad para sacar el clientId, si no existe pone null
    const clientId = client?.getClientId() || null;

    // Le regresa el clientId a
    return {
        client,
        clientId,
    };
}

export default useAuthenticatedClient;