import api from '../../../api/axiosConfig'; 
import { handleHttpError } from '../../infrastructure/httpErrorHandler';


export class AdminProfileApi {

    async getProfileInformation(){
        try {
            const response = await api.get('/admin/perfil')
            return response.data;
        } catch (error){
            handleHttpError(error)
        }
    }

}