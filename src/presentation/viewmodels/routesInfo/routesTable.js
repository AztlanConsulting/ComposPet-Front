import { GetRoutesInfoUseCase } from "../../../domain/useCases/routesInfo/routesTableUseCase";

export class RoutesViewModel{
    constructor(){
        this.getRoutesInfoUseCase = new GetRoutesInfoUseCase();
    }

    async loadRoutesInfo(){
        console.log("Entro al load Routes info")
        try {
            const routes = await this.getRoutesInfoUseCase.execute();
            console.log("Routes VM============", routes);

            return {
                data: routes,
            };
        } catch (error){
            console.log("error")
            return{
                data: [],
                error: error.message || "Error al cargar la información de rutas",
            };
        }
            
    }
}