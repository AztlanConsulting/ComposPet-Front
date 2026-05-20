import api from '../../api/axiosConfig'; 
import { handleHttpError } from '../infrastructure/httpErrorHandler';

export class LogoutApiClient {
    async logout() {
        try {
            const response = await api.post('/cerrar-sesion');
            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    }
}