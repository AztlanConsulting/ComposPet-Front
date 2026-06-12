import { AdminProfileIRepository } from "../../../domain/repositories/admin/adminProfileInterfaceRepository";

export class AdminProfileRepository extends AdminProfileIRepository {
    constructor(apiClient){
        super();
        this.apiClient = apiClient;
    }

    async getProfileInformation(){
        const response = await this.apiClient.getProfileInformation();
        return response.data;
    }

    async updateProfileInformation(data){
        const response = await this.apiClient.updateProfileInformation(data);
        return response.data;
    }
}