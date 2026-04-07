
import { solicitudesRecIRepository } from '../../domain/repositories/solicitudesRecInterfaceRepository';
import { User } from '../../domain/entities/user';
import {SolicitudRec} from '../../domain/entities/solicitudRec';

/**
 * Implementación concreta del repositorio de solicitudes de recolección.
 * Actúa como adaptador entre el caso de uso y el cliente HTTP,
 * transformando la respuesta de la API en una entidad `SolicitudRec` del dominio.
 *
 * @extends SolicitudesRecIRepository
 * @see SolicitudesRecApiClient
 * @see SolicitudRec
 */

export class SolicitudesRecRepository extends solicitudesRecIRepository{

    /**
     * @param {import('../datasources/solicitudesRecApiClient').SolicitudesRecApiClient} apiClient
     * Cliente HTTP que realiza las peticiones al servidor del módulo de solicitudes.
     */

    constructor(apiClient){
        super();
        this.apiClient = apiClient;
    }

    /**
     * Obtiene la solicitud de recolección actual del cliente dentro del rango semanal indicado.
     * Mapea los campos de la respuesta del servidor a los atributos de `SolicitudRec`,
     * adaptando la nomenclatura de la API (snake_case) al dominio (camelCase).
     * 
     * @param {string} idCliente - Id del cliente en formato UUID.
     * @param {string} fechaInicioSemana - Fecha inicial del rango semanal.
     * @param {string} fechaFinSemana - Fecha final del rango semanal.
     * @param {string} token - Token JWT del usuario autenticado.
     * @returns {Promise<SolicitudRec>} Entidad de dominio con la solicitud obtenida.
     */

    async obtenerSolicitudRecActual(idCliente, fechaInicioSemana, fechaFinSemana){
        const data = await this.apiClient.obtenerSolicitudRecActual(idCliente, fechaInicioSemana, fechaFinSemana);

        return new SolicitudRec({
            idSolicitud: data.id_solicitud,
            idCliente: data.id_cliente,
            cubetasEntregadas: data.cubetas_entregadas,
            cubetasRecolectadas: data.cubetas_recolectadas,
            totalAPagar: data.total_a_pagar,
            totalPagado: data.total_pagado,
            fecha: data.fecha,
            horario: data.horario,
            notas: data.notas,
            quiereRecoleccion: data.quiere_recoleccion,
            quiereProductosExtra: data.quiere_productos_extra,
            idPago: data.id_pago,
        });
    }

    /**
     * Guarda la información de la primera sección del formulario de recolección
     * Mapea los campos de la respuesta del servidor a los atributos de `SolicitudRec`,
     * adaptando la nomenclatura de la API (snake_case) al dominio (camelCase).
     *
     * @param {string} idSolicitud - Id de la solicitud en formato UUID.
     * @param {boolean} quiereRecoleccion - Indica si el cliente desea recolección.
     * @param {boolean} quiereProductosExtra - Indica si el cliente desea productos extra.
     * @param {number} cubetasRecolectadas - Cantidad de cubetas que el cliente entregará.
     * @param {number} cubetasEntregadas - Cantidad de cubetas vacías solicitadas.
     */

    async guardarSolicitudRecPrimeraSeccion(idSolicitud, quiereRecoleccion, quiereProductosExtra, cubetasRecolectadas, cubetasEntregadas){
        const data = await this.apiClient.guardarSolicitudRecPrimeraSeccion(idSolicitud, quiereRecoleccion, quiereProductosExtra, cubetasRecolectadas, cubetasEntregadas);
        return new SolicitudRec({
            idSolicitud: data.id_solicitud,
            idCliente: data.id_cliente,
            cubetasEntregadas: data.cubetas_entregadas,
            cubetasRecolectadas: data.cubetas_recolectadas,
            totalAPagar: data.total_a_pagar,
            totalPagado: data.total_pagado,
            fecha: data.fecha,
            horario: data.horario,
            notas: data.notas,
            quiereRecoleccion: data.quiere_recoleccion,
            quiereProductosExtra: data.quiere_productos_extra,
            idPago: data.id_pago,
        });
    }

}