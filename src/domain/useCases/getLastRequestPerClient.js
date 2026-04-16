/**
 * Use case for retrieving the latest collection request of a client.
 */
export class GetLastRequestPerClient {

    /**
     * @param {import('../repositories/solicitudesRecInterfaceRepository').SolicitudesRecIRepository} solicitudesRecRepository
     */
    constructor(solicitudesRecRepository) {
        this.solicitudesRecRepository = solicitudesRecRepository;
    }

    /**
     * Executes the retrieval of the latest collection request.
     *
     * @param {string} idClient
     * @returns {Promise<import('../entities/solicitudRec').SolicitudRec | null>}
     */
    async execute(idClient) {
        const result = await this.solicitudesRecRepository.getLastRequestPerClient(idClient);
        return result;
    }
}