export class GetCompostStatusUseCase {
    constructor(repository) {
        this.repository = repository;
    }

    /**
     * Crea una instancia del caso de uso para consultar el estado de la composta
     *
     * @param {GetCompostStatusUseCase} 
     */
    async execute() {
        return await this.repository.getCompostStatus();
    }
}