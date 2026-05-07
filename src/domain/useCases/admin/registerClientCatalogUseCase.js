/**
 * Caso de uso para obtener los catálogos necesarios en el formulario de registro de clientes.
 * Actúa como intermediario entre la capa de presentación y el repositorio,
 * siguiendo el patrón de arquitectura limpia.
 */
export class RegisterClientCatalog {
    constructor(registerClientRepository){
        this.registerClientRepository = registerClientRepository;
    }

    /**
     * Ejecuta el caso de uso para obtener los catálogos del formulario de registro.
     *
     * @returns {Promise<import('../entities/admin/registerClientCatalog').RegisterClientCatalog>}
     * Entidad con los catálogos disponibles para el formulario.
     * @see RegisterClientRepository.getRegisterClient
     */
    async execute(){
        const registerCatalog = await this.registerClientRepository.getRegisterClient();
        return registerCatalog;
    }
}