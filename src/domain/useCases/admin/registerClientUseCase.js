/**
 * Caso de uso para registrar un nuevo cliente en el sistema.
 * Actúa como intermediario entre la capa de presentación y el repositorio,
 * siguiendo el patrón de arquitectura limpia.
 * Transforma los datos crudos del formulario en el contrato esperado por el repositorio
 * antes de ejecutar el registro.
 */
export class RegisterClient {
    constructor(registerClientRepository){
        this.registerClientRepository = registerClientRepository;
    }

    /**
     * Ejecuta el caso de uso para registrar un nuevo cliente.
     * Combina los dos apellidos del formulario en un solo campo antes de enviarlo.
     * Los campos `pets`, `family` y `notes` son opcionales y pueden no estar presentes.
     *
     * @param {Object} data - Datos crudos provenientes del formulario de registro.
     * @param {string} data.name - Nombre del cliente.
     * @param {string} data.lastname1 - Primer apellido del cliente.
     * @param {string} data.lastname2 - Segundo apellido del cliente.
     * @param {string} data.email - Correo electrónico del cliente.
     * @param {string} data.phone - Teléfono de contacto del cliente.
     * @param {string} data.address - Dirección de entrega del cliente.
     * @param {number} data.selectedDay - Identificador del día de ruta seleccionado.
     * @param {string} [data.pets] - Información sobre las mascotas del cliente. Opcional.
     * @param {string} [data.family] - Información sobre el grupo familiar del cliente. Opcional.
     * @param {string} [data.notes] - Notas adicionales sobre el cliente. Opcional.
     * @returns {Promise<import('../entities/admin/newClient').NewClient>}
     * Entidad con los datos del cliente recién registrado.
     * @see RegisterClientRepository.postRegisterClient
     */
    async execute(data){
        const clientData = {
            name: data.name,
            lastName: `${data.lastname1} ${data.lastname2}`.trim(),
            email: data.email,
            phone: data.phone,
            pets: data.pets,
            family: data.family,
            notes: data.notes,
            address: data.address,
            id_ruta: data.selectedDay,
            priceType: data.priceType,
        };

        const registerClient = await this.registerClientRepository.postRegisterClient(clientData);
        return registerClient;
    }
}