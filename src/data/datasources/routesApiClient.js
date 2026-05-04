import api from '../../api/axiosConfig';
import { handleHttpError } from '../infrastructure/httpErrorHandler';

export class RoutesApiClient {
    async getRoutesInfo() {
        try {
            const response = await api.get('/rutas/informacion');
            console.log("RESPONSE EN EL API CLIENT", response.data);
            return response.data;
        } catch (error) {
            console.error("Error en getRoutesInfo:", error.response?.data || error.message);
            throw error;
        }
    }
}