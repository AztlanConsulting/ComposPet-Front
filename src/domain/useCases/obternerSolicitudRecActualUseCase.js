/**
 * Caso de uso para obtener la solicitud de recolección actual del cliente.
 * Actúa como intermediario entre el ViewModel y el repositorio,
 * aplicando la validación de presencia antes de delegar al repositorio.
 *
 * @see SolicitudesRecIRepository
 */

export class ObtenerSolicitudRecActualUseCase {
    /**
     * @param {import('../repositories/solicitudesRecInterfaceRepository').SolicitudesRecIRepository} solicitudesRecRepository
     * Implementación del repositorio de solicitudes de recolección.
     */

    constructor(solicitudesRecRepository){
        this.solicitudesRecRepository = solicitudesRecRepository;
    }

    /**
     * Ejecuta la obtención de la solicitud de recolección actual del cliente
     * dentro del rango semanal indicado.
     *
     * @param {string} idCliente - Id del cliente en formato UUID.
     * @param {string} fechaInicioSemana - Fecha inicial del rango semanal.
     * @param {string} fechaFinSemana - Fecha final del rango semanal.
     * @returns {Promise<import('../entities/solicitudRec').SolicitudRec>} Entidad de solicitud de recolección.
     * @throws {Error} Si falta algún dato requerido o si el repositorio falla.
     */

    async execute(idCliente, fechaInicioSemana, fechaFinSemana){
        console.log('UseCase execute recibió:', {
            idCliente,
            fechaInicioSemana,
            fechaFinSemana,
        });
        if(!idCliente || !fechaInicioSemana || !fechaFinSemana){
            throw new Error("Faltan parámetros requeridos")
        }

        const solicitudRec = await this.solicitudesRecRepository.obtenerSolicitudRecActual(
            idCliente,
            fechaInicioSemana,
            fechaFinSemana,
        );

        console.log('Solicitud de recolección actual obtenida:', solicitudRec);
        return solicitudRec; 
    }
}