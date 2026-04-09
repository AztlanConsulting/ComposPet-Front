import { firstLoginIRepository } from "../../domain/repositories/firstLoginInterfaceRepository";
import { FirstLogin } from "../../domain/entities/firstLogin";
import axios from 'axios';

export class FirstLoginRepository extends firstLoginIRepository {
    constructor(apiClient){
        super();
        this.apiClient = apiClient;
    }

    async requestOTP(email) {
        try {
            const data = await this.apiClient.requestOTP(email);

            return new FirstLogin({
                email: data.correo, 
                token: data.seedToken,
                step: 'CAN_VERIFY', 
            })
        } catch (error) {
            throw error;
        }
    }

    async verifyOTP(email, code, seedToken) {
        try {
            const data = await this.apiClient.verifyOTP(email, code, seedToken);

            return new FirstLogin({
                email: email,
                token: data.flowToken,
                step: 'VERIFIED_STEP', 
            })
        } catch (error) {
            throw error;
        }
    }

    async updatePassword(email, password, flowToken) {
        try {
            return await this.apiClient.updatePassword(email, password, flowToken);
        } catch (error) {
            throw error;
        }
    }
}