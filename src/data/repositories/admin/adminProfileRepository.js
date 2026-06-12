import { AdminProfileIRepository } from "../../../domain/repositories/admin/adminProfileInterfaceRepository";
import { AdminProfileInformation } from "../../../domain/entities/admin/adminProfileInformation";

export class AdminProfileRepository extends AdminProfileIRepository{

    constructor(apiClient){
        super();
        this.apiClient = apiClient
    }

    async getProfileInformation(){
        const response = await this.apiClient.getProfileInformation();

        const data = response.data;

        return new AdminProfileInformation({
            profile: data.profile,
        });
    }
}