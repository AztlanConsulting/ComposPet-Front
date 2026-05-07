import { RegisterClientApi } from '../../data/datasources/admin/registerClientApi';
import { RegisterClientRepository } from '../../data/repositories/admin/registerClientRepository';

import { RegisterClientCatalog } from '../../domain/useCases/admin/registerClientCatalogUseCase';
import { RegisterClient } from '../../domain/useCases/admin/registerClientUseCase';

const registerClientApi = new RegisterClientApi();
const registerClientRepository = new RegisterClientRepository(registerClientApi);
export const registerClientCatalogUseCase = new RegisterClientCatalog(registerClientRepository);
export const registerClientUseCase = new RegisterClient(registerClientRepository);