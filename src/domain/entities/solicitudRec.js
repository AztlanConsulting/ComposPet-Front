/**
 * Entidad de dominio que representa a una solicitud de recolección.
 * Encapsula los datos de la solicitud y expone métodos para consultar
 * su información sin exponer la lógica de manipulación al exterior.
 */

export class SolicitudRec {

    /**
     * @param {object} params - Datos de la solicitud provenientes del repositorio
     * @param {string} params.idSolicitud - Id único de la solicitud
     * @param {string} params.idCliente - Id único del cliente.
     * @param {number} params.cubetasEntregadas - Cantidad de cubetas vacías solicitadas
     * @param {number} params.cubetasRecolectadas - Cantidad de cubetas entregadas por el cliente
     * @param {number} params.totalAPagar - Total a pagar asociado a la solicitud
     * @param {number} params.totalPagado - Total pagado asociado a la solicitud
     * @param {string|Date} params.fecha - Fecha de la solicitud
     * @param {string|Date} params.horario - Horario asociado a la solicitud
     * @param {string} params.notas - Notas adicionales de la solicitud
     * @param {boolean} params.quiereRecoleccion - Indica si el cliente desea recolección.
     * @param {boolean} params.quiereProductosExtra - Indica si el cliente desea productos extra.
     * @param {number} params.idPago - Id de la forma de pago asociada.
     */

    constructor({
        idSolicitud,
        idCliente,
        cubetasEntregadas,
        cubetasRecolectadas,
        totalAPagar,
        totalPagado,
        fecha,
        horario,
        notas,
        quiereRecoleccion,
        quiereProductosExtra,
        idPago,
    }) {
        this.idSolicitud = idSolicitud;
        this.idCliente = idCliente;
        this.cubetasEntregadas = cubetasEntregadas;
        this.cubetasRecolectadas = cubetasRecolectadas;
        this.totalAPagar = totalAPagar;
        this.totalPagado = totalPagado;
        this.fecha = fecha;
        this.horario = horario;
        this.notas = notas;
        this.quiereRecoleccion = quiereRecoleccion;
        this.quiereProductosExtra = quiereProductosExtra;
        this.idPago = idPago;
    }

    /**
     * Indica si el cliente desea recolección
     *
     * @returns {boolean} `true` si el cliente desea recolección
     */
    deseaRecoleccion(){
        return this.quiereRecoleccion === true;
    }

    /**
     * Indica si el cliente desea productos extra
     *
     * @returns {boolean} `true` si el cliente desea productos extra.
     */
    deseaProductosExtra(){
        return this.quiereProductosExtra === true;
    }

    /**
     * Retorna la cantidad de cubetas que el cliente entregará
     * 
     * @return {number} Cantidad de cubetas que el cliente entregará
     */
    obtenerCubetasRecolectadas() {
        return this.cubetasRecolectadas;
    }

    /**
     * Retorna la cantidad de cubetas vacías solicitadas por el cliente
     * 
     * @return {number} Cantidad de cubetas vacías solicitadas por el cliente
     */
    obtenerCubetasEntregadas() {
        return this.cubetasEntregadas;
    }
    

}