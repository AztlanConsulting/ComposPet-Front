/**
 * Entidad del dominio que representa los catálogos necesarios
 * para renderizar el formulario de registro de un nuevo cliente.
 * Encapsula los datos retornados por la API antes de iniciar el registro.
 */
export class RegisterClientCatalog {
    /**
     * @param {Object} params - Parámetros de construcción de la entidad.
     * @param {Array<{ id_ruta: number, dia_ruta: string }>} params.daysOfRoutes
     * Listado de días de ruta disponibles para asignar al cliente.
     */
    constructor({ 
        daysOfRoutes
    }) {
        this.daysOfRoutes = daysOfRoutes;
    }
}