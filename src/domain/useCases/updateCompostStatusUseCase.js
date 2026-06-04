export class UpdateCompostStatusUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Crea una instancia del caso de uso para actualizar el estado de la composta
     *
     * @param {UpdateCompostStatusUseCase} 
     */
    async execute(newStatus) {
        return await this.repository.updateCompostStatus(newStatus);
    }
}