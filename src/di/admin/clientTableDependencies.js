// CLI-03
import { GetClientTableUseCase } from "../../domain/useCases/getClientTableUseCase";
import { ClientTableRepository } from "../../data/repositories/clientTableRepository";
import { UpdateClientRepository } from "../../data/repositories/updateClientRepository";
import { ClientApiClient } from "../../data/datasources/clientApiClient";

// CLI-07
import { GetRoutesUseCase } from "../../domain/useCases/getRoutesUseCase";
import { UpdateClientUseCase } from "../../domain/useCases/updateClientUseCase";

const apiClient = new ClientApiClient();
const getRepository = new ClientTableRepository(apiClient);
const updateRepository = new UpdateClientRepository(apiClient);

export const getTableUseCase = new GetClientTableUseCase(getRepository)
export const getRoutesUseCase = new GetRoutesUseCase(updateRepository)
export const updateClientUseCase = new UpdateClientUseCase(updateRepository);