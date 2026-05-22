// CLI-03
import { GetClientTableUseCase } from "../../domain/useCases/getClientTableUseCase";
import { ClientTableRepository } from "../../data/repositories/clientTableRepository";
import { UpdateClientRepository } from "../../data/repositories/updateClientRepository";
import { ClientApiClient } from "../../data/datasources/clientApiClient";

// CLI-07
import { GetRoutesUseCase } from "../../domain/useCases/getRoutesUseCase";
import { UpdateClientUseCase } from "../../domain/useCases/updateClientUseCase";

// CLI-06
import { GetCompostStatusUseCase } from "../../domain/useCases/getCompostStatusUseCase";
import { UpdateCompostStatusUseCase } from "../../domain/useCases/updateCompostStatusUseCase";


const apiClient = new ClientApiClient();
const getRepository = new ClientTableRepository(apiClient);
const updateRepository = new UpdateClientRepository(apiClient);

export const getTableUseCase = new GetClientTableUseCase(getRepository)
export const getRoutesUseCase = new GetRoutesUseCase(updateRepository)
export const updateClientUseCase = new UpdateClientUseCase(updateRepository);
export const getCompostStatusUseCase = new GetCompostStatusUseCase(getRepository);
export const updateCompostStatusUseCase = new UpdateCompostStatusUseCase(getRepository);