/**
 * Caso de uso para obtener la solicitud de recolección actual del cliente.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see CollectionRequestIRepository
 */

export class GetCurrentCollectionRequestUseCase {
    /**
     * Crea una instancia del caso de uso para obtener la solicitud actual.
     *
     * @param {import('../repositories/collectionRequestInterfaceRepository').CollectionRequestIRepository} collectionRequestRepository - Implementación del repositorio de solicitudes de recolección.
     */
    constructor(collectionRequestRepository){
        this.collectionRequestRepository = collectionRequestRepository;
    }

    /**
     * Ejecuta la obtención de la solicitud de recolección actual del cliente
     * dentro del rango semanal indicado.
     *
     * @param {string} clientId - Id del cliente en formato UUID.
     * @param {string} weekStartDate - Fecha inicial del rango semanal.
     * @param {string} weekEndDate - Fecha final del rango semanal.
     * @returns {Promise<import('../entities/collectionRequest').CollectionRequest>} Entidad de solicitud de recolección.
     * @throws {Error} Si falta algún dato requerido o si el repositorio falla.
     */
    async execute(clientId, weekStartDate, weekEndDate){

        if(!clientId || !weekStartDate || !weekEndDate){
            throw new Error("Faltan parámetros requeridos")
        }

        const collectionRequest = await this.collectionRequestRepository.getCurrentCollectionRequest(
            clientId,
            weekStartDate,
            weekEndDate,
        );

        return collectionRequest; 
    }
}