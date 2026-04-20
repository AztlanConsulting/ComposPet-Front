
import { CollectionSummary } from "../../domain/entities/collectionSummary";

/**
 * Implementación concreta del repositorio de resumen de la solicitud.
 * Actúa como adaptador entre el caso de uso y el cliente HTTP,
 * transformando la respuesta de la API en una entidad `CollectionSummary` del dominio.
 *
 * @extends CollectionSummaryIRepository
 * @see CollectionRequestApiClient
 * @see CollectionSummary
 */
export class CollectionSummaryRepositoryImpl {
    constructor(datasource) {
        this.datasource = datasource;
    }

    async getSummary(idClient, weekStartDate, weekEndDate) {
        const response = await this.datasource.getSummary(
            idClient,
            weekStartDate,
            weekEndDate
        );

        return new CollectionSummary(
            response.data.collection,
            response.data.products,
            response.data.balance,
            response.data.collectionTotal,
            response.data.payMethods
        );
    }
}