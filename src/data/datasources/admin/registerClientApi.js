import api from '../../../api/axiosConfig'; 
import { handleHttpError } from '../../infrastructure/httpErrorHandler';

/**
 * Cliente HTTP para el módulo de registro de clientes.
 * Implementa las llamadas al backend mediante la instancia de Axios configurada.
 * Los errores de red o de respuesta son procesados por {@link handleHttpError}
 * antes de propagarse a las capas superiores.
 *
 * @see handleHttpError
 */
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