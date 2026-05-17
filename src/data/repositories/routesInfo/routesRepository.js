
import { RoutesApiClient } from '../../datasources/routesApiClient';
import { RouteInfo } from '../../../domain/entities/routesInfo/routeInfo';

/**
 * Repositorio para operaciones relacionadas con rutas.
 * Implementa el patrón Repository, abstrayendo el acceso a datos
 * y transformando las respuestas del API en entidades de dominio.
 * 
 * @class RoutesRepository
 */
export class RoutesRepository{

    /**
     * Crea una instancia de RoutesRepository.
     * Inicializa el cliente API necesario para las operaciones de datos.
     * 
     * @constructor
     */
    constructor(){
        this.apiClient = new RoutesApiClient();
    }

    /**
     * Obtiene la lista de rutas del día actual y las transforma en entidades de dominio.
     * Realiza una petición al API, procesa la respuesta y convierte cada ruta
     * en una instancia de RouteInfo con los datos mapeados.
     *
     * @async
     * @returns {Promise<Array<RouteInfo>>} Promesa que resuelve con un array de objetos RouteInfo.
     * @throws {Error} Lanza un error si la petición al API falla o si hay problemas
     * al transformar los datos.
     * 
     */
    async getRoutesInfo() {
        const response = await this.apiClient.getRoutesInfo();

        const routes = response.data;

        const routesList = [];

        for (const route of routes) {
            const routeObject = new RouteInfo({
                name: route.nombre,
                collectedBuckets: route.recoleccion,
                deliveredBuckets: route.entrega,
                extraProducts: route.productos_extra,
                schedule: route.horario,
                paymentMethod: route.forma_pago,
                totalToPay: route.total_a_pagar,
                totalPaid: route.total_pagado,
                notes: route.notas,
                hasRequest: route.hasRequest,
                status: route.status,
                wantsCollection: route.wantsCollection,
                wantsExtraProducts: route.wantsExtraProducts,
                extraProductsDetails: route.extraProductsDetails || [],
            });

            routesList.push(routeObject);
        }

        return routesList;
    }

    async getAvailableWeeks() {
        const response = await this.apiClient.getAvailableWeeks();
        return response.data;
    }

    async getDaysOfRoutes() {
        const response = await this.apiClient.getDaysOfRoutes();
        return response.data;
    }

    async getFilteredRoutes(weekIndex, dayName) {
        const response = await this.apiClient.getFilteredRoutes(weekIndex, dayName);

        return response.data.map(route => new RouteInfo({
            name: route.nombre,
            collectedBuckets: route.recoleccion,
            deliveredBuckets: route.entrega,
            extraProducts: route.productos_extra,
            schedule: route.horario,
            paymentMethod: route.forma_pago,
            totalToPay: route.total_a_pagar,
            totalPaid: route.total_pagado,
            notes: route.notas,
            hasRequest: route.hasRequest,
            status: route.status,
            wantsCollection: route.wantsCollection,
            wantsExtraProducts: route.wantsExtraProducts,
            extraProductsDetails: route.extraProductsDetails || [],
        }));
    }
}