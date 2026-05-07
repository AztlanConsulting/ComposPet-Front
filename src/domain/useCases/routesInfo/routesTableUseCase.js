import { RoutesRepository } from '../../../data/repositories/routesInfo/routesRepository';

export class GetRoutesInfoUseCase {
    constructor(){
        this.routesRepository = new RoutesRepository();
    }

    async execute(){
        return await this.routesRepository.getRoutesInfo();
    }
}