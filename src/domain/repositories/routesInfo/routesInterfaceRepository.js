/**
 * Interfaz para repositorios de rutas.
 * Define los métodos que deben ser implementados por cualquier
 * repositorio concreto que maneje operaciones de rutas.
 * 
 * Esta clase no debe ser instanciada directamente, sino extendida
 * por clases concretas que implementen la lógica real.
 * 
 * @interface RoutesIRepository
 * @abstract
 * 
 */
export class RoutesIRepository {
   /**
   * Obtiene la información de las rutas.
   * Este método debe ser implementado por las clases que extiendan esta interfaz.
   *
   * @abstract
   * @async
   * @returns {Promise<Array<RouteInfo>>} Promesa que resuelve con un array de objetos RouteInfo.
   * @throws {Error} Lanza un error si el método no ha sido implementado en la clase derivada.
   * 
   */
  async getRoutesInfo() {
    throw new Error('Error al obtener la información');
  }

  async getAvailableWeeks(){
    throw new Error('Error al obtener la información de semanas');
  }

  async getDaysOfRoutes(){
    throw new Error('Error al obtener la información de dias de ruta');
  }

  async getFilteredRoutes(){
    throw new Error('Error al obtener la información para filtrar rutas por dia');
  }

  async getDropdownInfo(){
    throw new Error('Error al obtener la información necesaria para editar la recolección');
  }
}