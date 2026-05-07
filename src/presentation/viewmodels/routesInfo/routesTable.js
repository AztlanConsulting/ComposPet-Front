import { GetRoutesInfoUseCase } from "../../../domain/useCases/routesInfo/routesTableUseCase";

export class RoutesViewModel{
    constructor(){
        this.getRoutesInfoUseCase = new GetRoutesInfoUseCase();
    }

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