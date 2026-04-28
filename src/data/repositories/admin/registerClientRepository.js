import { RegisterClientCatalog } from "../../../domain/entities/admin/registerClientCatalog";
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

}