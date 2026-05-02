/**
 * Interfaz base para el repositorio de registro de clientes.
 * Define el contrato que deben implementar todas las clases concretas
 * que gestionen el registro de clientes en la aplicación.
 * Sigue el patrón Repository para desacoplar la capa de dominio
 * de la fuente de datos concreta.
 *
 * @interface RegisterClientIRepository
 */
export class RegisterClientIRepository {
    async getRegisterClient(){
        throw new Error("RegisterNewClientRepositoryInterface.getRegisterClient() not implemented")
    }

    async postRegisterClient(clientData){
        throw new Error("RegisterNewClientRepositoryInterface.postRegisterClient() not implemented")
    }
}