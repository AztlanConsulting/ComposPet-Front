import { RegisterClientCatalog } from "../../../domain/entities/admin/registerClientCatalog";
import { NewClient } from "../../../domain/entities/admin/newClient";
import { RegisterClientIRepository } from "../../../domain/repositories/admin/registerClientInterfaceRepository";

export class RegisterClientRepository extends RegisterClientIRepository{

    constructor(apiClient){
        super();
        this.apiClient = apiClient
    }

    async getRegisterClient(){
        const response = await this.apiClient.getRegisterClient();

        const data = response.data;

        return new RegisterClientCatalog({
            states: data.states,
            towns: data.towns,
            daysOfRoutes: data.daysOfRoutes,
            zones: data.zones,
        });
    }

    async postRegisterClient(clientData){
        const response = await this.apiClient.postRegisterClient(clientData);

        const data = response.data;

        return new NewClient({
            userId: data.id_usuario,
            clientId: data.id_cliente,
            email: data.correo,
            credit: data.saldo,
        });
    }

}