
import { RoutesApiClient } from '../../datasources/routesApiClient';
import { RouteInfo } from '../../../domain/entities/routesInfo/routeInfo';


export class RoutesRepository{

    constructor(){
        this.apiClient = new RoutesApiClient();
    }

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
            });

            routesList.push(routeObject);
        }

        return routesList;
    }

}