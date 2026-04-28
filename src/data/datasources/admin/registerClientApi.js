import api from '../../../api/axiosConfig'; 
import { handleHttpError } from '../../infrastructure/httpErrorHandler';

export class RegisterClientApi {

    async getRegisterClient(){
        try {
            const response = await api.get('/admin/registrar-cliente')
            return response.data;
        } catch (error){
            handleHttpError(error)
        }
    }

    async postRegisterClient(clientData){
        try {
            const response = await api.post('/admin/registrar-cliente', clientData);
            return response.data;
        } catch (error){
            handleHttpError(error)
        }
    }
}