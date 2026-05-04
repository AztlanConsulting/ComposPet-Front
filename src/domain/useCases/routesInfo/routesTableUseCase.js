import { RoutesRepository } from '../../../data/repositories/routesInfo/routesRepository';

export class GetRoutesInfoUseCase {
    constructor(){
        this.routesRepository = new RoutesRepository();
    }

    async execute(){
        console.log("use case :)")
        return await this.routesRepository.getRoutesInfo();
    }
}