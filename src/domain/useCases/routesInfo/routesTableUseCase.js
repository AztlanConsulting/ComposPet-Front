import { RoutesRepository } from '../../../data/repositories/routesInfo/routesRepository';

/**
 * Caso de uso para obtener la información de rutas.
 * Encapsula la lógica de negocio para recuperar y procesar
 * la información de las rutas del día actual.
 * 
 * @class GetRoutesInfoUseCase
 */
export class GetRoutesInfoUseCase {
    /**
     * Crea una instancia de GetRoutesInfoUseCase.
     * Inicializa el repositorio de rutas necesario para ejecutar el caso de uso.
     * 
     * @constructor
     */
    constructor(){
        this.routesRepository = new RoutesRepository();
    }

     /**
     * Ejecuta el caso de uso para obtener la información de rutas.
     * Delega la operación al repositorio y retorna la lista de rutas
     * como entidades de dominio.
     *
     * @async
     * @returns {Promise<Array<RouteInfo>>} Promesa que resuelve con un array de objetos RouteInfo,
     * cada uno representando una ruta con su información completa.
     * @throws {Error} Lanza un error si ocurre algún problema al obtener los datos
     * del repositorio o del API.
     */
    async execute(){
        return await this.routesRepository.getRoutesInfo();
    }
}