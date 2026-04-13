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

    const rawUser = sessionStorage.getItem('user');
    const storedUser = rawUser ? JSON.parse(rawUser) : null;
    const idUsuario = storedUser?.id || null;

    useEffect(() => {
        const obtenerCliente = async () => {
            try {
                const apiClient = new ClientApiClient();
                const clientRepository = new ClientRepository(apiClient);
                const getClientUseCase = new GetClientUseCase(clientRepository);

                const clientEntity = await getClientUseCase.execute(idUsuario);

                setClient(clientEntity);
            } catch (error) {
                console.error('Error al obtener el cliente autenticado:', error);
            }
        };

        if (idUsuario) {
            obtenerCliente();
        }
    }, [idUsuario]);

    const idCliente = client?.obtenerIdCliente() || null;

    return {
        client,
        idCliente,
    };
}

export default useAuthenticatedClient;