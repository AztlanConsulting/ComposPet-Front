import { RegisterClientCatalog } from "../../../../domain/entities/admin/registerClient/registerClientCatalog";
import { RegisterClientIRepository } from "./registerClientRepository";

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