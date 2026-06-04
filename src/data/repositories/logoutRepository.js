import { LogoutIRepository } from "../../domain/repositories/logoutInterfaceRepository";
import { LogoutApiClient } from "../datasources/LogoutApiClient";

export class LogoutRepository extends LogoutIRepository {
    /**
     * Inicializa las dependencias necesarias para la gestión de sesión.
     */
    constructor() {
        super();
        this.apiClient = new LogoutApiClient();
    }
    
    /**
     * Cierra la sesión del usuario tanto en el servidor (invalidando el refresh token)
     * como en el cliente (limpiando el token de acceso en memoria).
     * 
     * @async
     * @returns {Promise<object>} Respuesta del servidor.
     * @throws {Error} Si ocurre un error en la comunicación con la API.
     */
    async logout() {
        try {
            const data = await this.apiClient.logout();
            return data;
        } catch (error) {
            throw error;
        }
    }
}