/**
 * Use case for retrieving the latest collection request of a client.
 */
export class ObtenerUltimaSolicitudUseCase {

    /**
     * @param {import('../repositories/solicitudesRecInterfaceRepository').SolicitudesRecIRepository} solicitudesRecRepository
     */
    constructor(solicitudesRecRepository) {
        this.solicitudesRecRepository = solicitudesRecRepository;
    }

    /**
     * Executes the retrieval of the latest collection request.
     *
     * @param {string} idCliente
     * @returns {Promise<import('../entities/solicitudRec').SolicitudRec | null>}
     */
    async execute(idCliente) {
        return await this.solicitudesRecRepository.obtenerUltimaSolicitudRec(idCliente);
    }
}