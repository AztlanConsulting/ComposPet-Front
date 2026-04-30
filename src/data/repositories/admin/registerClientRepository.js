import { RegisterClientCatalog } from "../../../domain/entities/admin/registerClientCatalog";
import { NewClient } from "../../../domain/entities/admin/newClient";
import { RegisterClientIRepository } from "../../../domain/repositories/admin/registerClientInterfaceRepository";

/**
 * Implementación concreta del repositorio de registro de clientes.
 * Extiende {@link RegisterClientIRepository} y delega las llamadas
 * a la fuente de datos mediante el cliente de API inyectado.
 * Transforma las respuestas crudas de la API en entidades del dominio.
 *
 * @extends RegisterClientIRepository
 */
export class RegisterClientRepository extends RegisterClientIRepository{
    /**
     * @param {Object} apiClient - Cliente de API que provee los métodos de comunicación
     * con el backend. Debe implementar `getRegisterClient` y `postRegisterClient`.
     */
    constructor(apiClient){
        super();
        this.apiClient = apiClient
    }

    async getRegisterClient(){
        const response = await this.apiClient.getRegisterClient();

        const data = response.data;

        return new RegisterClientCatalog({
            daysOfRoutes: data.daysOfRoutes,
        });
    }

    async postRegisterClient(clientData){
        const response = await this.apiClient.postRegisterClient(clientData);

        const data = response.data;

        return new NewClient({
            userId: data.id_usuario,
            clientId: data.id_cliente,
            email: data.correo,
            credit: data.credit,
        });
    }

}