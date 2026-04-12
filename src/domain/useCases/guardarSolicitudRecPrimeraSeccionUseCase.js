/**
 * Caso de uso para guardar la primera sección del formulario de recolección.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see SolicitudesRecIRepository
 */
export class GuardarSolicitudRecPrimeraSeccionUseCase {
    /**
     * @param {import('../../domain/repositories/solicitudesRecInterfaceRepository').SolicitudesRecIRepository} solicitudesRecRepository
     * Implementación del repositorio de solicitudes de recolección.
     */
    constructor(solicitudesRecRepository) {
        this.solicitudesRecRepository = solicitudesRecRepository;
    }

    /**
     * Ejecuta la función de guardar la primera sección de la solicitud de recolección.
     *
     * @param {string} idSolicitud - Id de la solicitud 
     * @param {boolean} quiereRecoleccion - Indica si el cliente desea recolección.
     * @param {boolean} quiereProductosExtra - Indica si el cliente desea productos extra.
     * @param {number} cubetasRecolectadas - Cantidad de cubetas vacías solicitadas.
     * @param {number} cubetasEntregadas - Cantidad de cubetas que el cliente entregará.
     * @returns {Promise<import('../entities/solicitudRec').SolicitudRec>} Entidad de solicitud de recolección actualizada.
     * @throws {Error} Si falta algún dato requerido o si el repositorio falla.
     */
    async execute(
        idSolicitud,
        quiereRecoleccion,
        quiereProductosExtra,
        cubetasRecolectadas,
        cubetasEntregadas,
    ) {
        if (
            !idSolicitud
            || quiereRecoleccion === undefined
            || quiereProductosExtra === undefined
        ) {
            throw new Error('Faltan datos requeridos para guardar la primera sección de la solicitud.');
        }

        const solicitudRec = await this.solicitudesRecRepository.guardarSolicitudRecPrimeraSeccion(
            idSolicitud,
            quiereRecoleccion,
            quiereProductosExtra,
            cubetasRecolectadas,
            cubetasEntregadas,
        );

        return solicitudRec;
    }
}
