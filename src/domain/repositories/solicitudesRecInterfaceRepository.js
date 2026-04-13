/**
 * Interfaz abstracta del repositorio de solicitudes de recolección
 * Define el contrato que deben cumplir todas las implementaciones
 * del repositorio dentro de la capa de datos.
 *
 * Cualquier clase que extienda esta interfaz debe sobrescribir
 * los metodos definidos si no dara error
 *
 * @abstract
 */

export class SolicitudesRecIRepository{
    /**
     * Obtiene la solicitud de recolección actual del cliente dentro del rango semanal indicado.
     *
     * @abstract
     * @param {string} idCliente - Id del cliente
     * @param {string} fechaInicioSemana - Fecha inicial del rango semanal.
     * @param {string} fechaFinSemana - Fecha final del rango semanal.
     * @throws {Error} 
     */

    async obtenerSolicitudRecActual(idCliente, fechaInicioSemana, fechaFinSemana){
        throw new Error("solicitudesRecIRepository.obtenerSolicitudRecActual() no implementado");
    }

    /**
     * Guarda la información de la primera sección del formulario de recolección
     *
     * @abstract
     * @param {string} idSolicitud - Id de la solicitud 
     * @param {boolean} quiereRecoleccion - Indica si el cliente desea recolección
     * @param {boolean} quiereProductosExtra - Indica si el cliente desea productos extra
     * @param {number} cubetasRecolectadas - Cantidad de cubetas que el cliente entregará
     * @param {number} cubetasEntregadas - Cantidad de cubetas vacías solicitadas
     * @throws {Error} 
     */
    async guardarSolicitudRecPrimeraSeccion(
        idSolicitud, 
        quiereRecoleccion, 
        quiereProductosExtra, 
        cubetasRecolectadas, 
        cubetasEntregadas
    ){
        throw new Error("solicitudesRecIRepository.guardarSolicitudRecPrimeraSeccion() no implementado");
    }

    /**
     * Retrieves available extra products.
     *
     * @abstract
     * @throws {Error}
     */
    async getExtraProducts() {
        throw new Error("CollectionRequestRepositoryInterface.getExtraProducts() not implemented");
    }


    async guardarExtraProducts(idSolicitud, productos) {
        throw new Error("SolicitudesRecIRepository.guardarExtraProducts() no implementado");
    }

}