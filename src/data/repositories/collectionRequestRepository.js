
import { CollectionRequestIRepository } from '../../domain/repositories/collectionRequestInterfaceRepository';
import { CollectionRequest } from '../../domain/entities/collectionRequest';
import { ExtraProduct } from '../../domain/entities/extraProduct';
import { RequestIdentifier } from '../../domain/entities/requestIdentifier';
import { ExtraProductRequest } from '../../domain/entities/extraProductRequestCollection';

/**
 * Implementación concreta del repositorio de solicitudes de recolección.
 * Actúa como adaptador entre el caso de uso y el cliente HTTP,
 * transformando la respuesta de la API en una entidad `CollectionRequest` del dominio.
 *
 * @extends CollectionRequestIRepository
 * @see CollectionRequestApiClient
 * @see CollectionRequest
 */
export class CollectionRequestRepository extends CollectionRequestIRepository{

    /**
     * Crea una instancia del repositorio de solicitudes de recolección.
     *
     * @param {import('../datasources/collectionRequestApiClient').CollectionRequestApiClient} apiClient - Cliente HTTP que realiza las peticiones al servidor del módulo de solicitudes.
     */

    constructor(apiClient){
        super();
        this.apiClient = apiClient;
    }

    /**
     * Obtiene la solicitud de recolección actual del cliente dentro del rango semanal indicado.
     * Mapea los campos de la respuesta del servidor a los atributos de `CollectionRequest`,
     * adaptando la nomenclatura de la API (snake_case) al dominio (camelCase).
     *
     * @param {string} clientId - Id del cliente en formato UUID.
     * @param {string} weekStartDate - Fecha inicial del rango semanal.
     * @param {string} weekEndDate - Fecha final del rango semanal.
     * @param {string} token - Token JWT del usuario autenticado.
     * @returns {Promise<CollectionRequest>} Entidad de dominio con la solicitud encontrada.
     */
    async getCurrentCollectionRequest(clientId, weekStartDate, weekEndDate){
        const response = await this.apiClient.getCurrentCollectionRequest(
            clientId,
            weekStartDate,
            weekEndDate,
        );

        // Permite acceder al cuerpo de la respuesta enviada por el backend
        const data = response.data;

        return new CollectionRequest({
            id: data.id_solicitud,
            clientId: data.id_cliente,
            deliveredBuckets: data.cubetas_entregadas,
            collectedBuckets: data.cubetas_recolectadas,
            totalToPay: data.total_a_pagar,
            totalPaid: data.total_pagado,
            date: data.fecha,
            schedule: data.horario,
            notes: data.notas,
            wantsCollection: data.quiere_recoleccion,
            wantsExtraProducts: data.quiere_productos_extra,
            paymentId: data.id_pago,
        });
    }

    /**
     * Guarda la información de la primera sección del formulario de recolección.
     * Mapea los campos de la respuesta del servidor a los atributos de `CollectionRequest`,
     * adaptando la nomenclatura de la API al dominio.
     *
     * @param {string} requestId - Id de la solicitud en formato UUID.
     * @param {boolean} wantsCollection - Indica si el cliente desea recolección.
     * @param {boolean} wantsExtraProducts - Indica si el cliente desea productos extra.
     * @param {number} collectedBuckets - Cantidad de cubetas que el cliente entregará.
     * @param {number} deliveredBuckets - Cantidad de cubetas vacías solicitadas.
     * @returns {Promise<CollectionRequest>} Entidad de dominio con la solicitud actualizada.
     */
    async saveCollectionRequestFirstSection(
        requestId,
        wantsCollection,
        wantsExtraProducts,
        collectedBuckets,
        deliveredBuckets,
    ) {
        const response = await this.apiClient.saveCollectionRequestFirstSection(
            requestId,
            wantsCollection,
            wantsExtraProducts,
            collectedBuckets,
            deliveredBuckets,
        );

        // Permite acceder al cuerpo de la respuesta enviada por el backend
        const data = response.data;

        return new CollectionRequest({
            id: data.id_solicitud,
            clientId: data.id_cliente,
            deliveredBuckets: data.cubetas_entregadas,
            collectedBuckets: data.cubetas_recolectadas,
            totalToPay: data.total_a_pagar,
            totalPaid: data.total_pagado,
            date: data.fecha,
            schedule: data.horario,
            notes: data.notas,
            wantsCollection: data.quiere_recoleccion,
            wantsExtraProducts: data.quiere_productos_extra,
            paymentId: data.id_pago,
        });
    }


    /**
     * Obtiene los productos extra disponibles y los transforma
     * en entidades de dominio `ExtraProduct`.
     *
     * @returns {Promise<Array<ExtraProduct>>} Lista de productos extra disponibles.
     * */
    async getExtraProducts(){
        const response = await this.apiClient.getExtraProducts();

        return response.data.map(productData => new ExtraProduct({
            idProduct: productData.id_producto,
            name: productData.nombre,
            price: productData.precio,
            description: productData.descripcion,
            quantity: productData.cantidad,
            imageUrl: productData.imagen_url,
            status: productData.estatus,
        }));
    }

    /**
     * Guarda los productos extra seleccionados en la solicitud actual.
     * Envía al apiClient el id de la solicitud y la lista de productos elegidos.
     *
     * @param {string} requestID - Id de la solicitud en formato UUID.
     * @param {Array<Object>} products - Lista de productos extra seleccionados.
     * @returns {Promise<Object>} Respuesta del servidor con el resultado del guardado.
     */
    async saveExtraProducts(requestID,  products) {
        return await this.apiClient.saveExtraProducts(requestID, products);
    }

    /**
     * Obtiene el identificador de la última solicitud registrada por el cliente
     * y lo envuelve en la entidad de dominio `RequestIdentifier`.
     *
     * @param {string} idClient - Id del cliente.
     * @returns {Promise<RequestIdentifier>} Identificador de la última solicitud del cliente.
     */
    async getLastRequestPerClient(idClient){
        const requestID = await this.apiClient.getLastRequestPerClient(idClient);
        return new RequestIdentifier(requestID);
    }

    /**
     * Obtiene los productos extra previamente seleccionados en una solicitud
     * y los transforma en entidades de dominio `ExtraProductRequest`.
     *
     * @param {string} requestID - Id de la solicitud en formato UUID.
     * @returns {Promise<Array<ExtraProductRequest>>} Lista de productos extra seleccionados.
     */
    async getInfoAboutExtraProductsSelected(requestID) {
        const response = await this.apiClient.getInfoAboutExtraProductsSelected(requestID);

        const data = response?.data || response || [];

        return data.map(productData => new ExtraProductRequest({
            idProduct: productData.id_producto,
            quantity: productData.cantidad,
        }));
    }

}