import api from '../../api/axiosConfig'; 
import { handleHttpError } from '../infrastructure/httpErrorHandler';

export class ClientApiClient {
    
    /**
     * Obtiene la información básica del cliente asociado al id del usuario proporcionado.
     * * @async
     * @param {string} userId - Id del usuario (procedente del token o sesión).
     * @returns {Promise<Object>} Datos del cliente encontrado.
     * @throws {Error} Si el token es inválido o el cliente no existe.
     */
    async getClientByUserId(userId) {
        try {
            // Ya no es necesario mandar el token por que hay un interceptor de rutas, es el api.post
            // Envía el id del usuario al back y llama a la ruta
            const response = await api.post('/cliente/obtener-cliente-y-ruta', { userId });
            return response.data;

        } catch (error) {
            handleHttpError(error);
        }
    };

    /**
     * Obtiene la lista de clientes de Compospet
     * * @async
     * @returns {Promise<List<Object>>} Lista de clientes
     * @throws {Error}
     */
    async getClientTable(){
        try{

            const response = await api.get('cliente/informacion');
            return response.data.clientList;

        } catch (error) {
            handleHttpError(error);
        }
    };

    /**
     * Obtiene la lista de rutas disponibles
     * * @async
     * @returns {Promise<List<Object>>} Lista de rutas
     * @throws {Error}
     */
    async getRoutes(){
        try{

            const response = await api.get('/admin/actualizar-cliente');
            return response.data.routes;

        } catch (error) {
            handleHttpError(error);
        }
    };

    async updateClient(updatedClient){
        try{
            const response = await api.post('/admin/actualizar-cliente', {clientObject: updatedClient});
            return response.data;
        } catch (error) {
            handleHttpError(error);
        }
    };

    async getCompostStatus(){
        try{
            const response = await api.get("/cliente/estatus-composta");
            console.log("Compost status response: ", response.data);
            return response.data;
        } catch (error){
            handleHttpError(error);
        }
    };

    async updateCompostStatus(newStatus){
        try{
            const response = await api.post("/cliente/modificar-estatus-composta", { status: newStatus });
            console.log("Compost status update response: ", response);
            return response.data;
        } catch (error){
            handleHttpError(error);
        }
    };
}