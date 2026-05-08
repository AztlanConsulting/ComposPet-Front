import { GetRoutesInfoUseCase } from "../../../domain/useCases/routesInfo/routesTableUseCase";

/**
 * ViewModel para la gestión de información de rutas.
 * Actúa como intermediario entre la vista y la capa de dominio,
 * manejando la lógica de presentación y transformando los datos
 * para su consumo en la interfaz de usuario.
 * 
 * @class RoutesViewModel
 */
export class RoutesViewModel{
    /**
     * Crea una instancia de RoutesViewModel.
     * Inicializa el caso de uso necesario para obtener la información de rutas.
     */
    constructor(){
        this.getRoutesInfoUseCase = new GetRoutesInfoUseCase();
    }

    /**
     * Carga la información de las rutas del día actual.
     * Ejecuta el caso de uso correspondiente y maneja posibles errores,
     * retornando un objeto con formato consistente para la vista.
     */
    async loadRoutesInfo(){
        try {
            const routes = await this.getRoutesInfoUseCase.execute();

            return {
                data: routes,
            };
        } catch (error){
            return{
                data: [],
                error: error.message || "Error al cargar la información de rutas",
            };
        }
            
    }
}