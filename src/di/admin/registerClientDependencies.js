import { RegisterClientApi } from '../../data/datasources/admin/registerClientApi';
import { RegisterClientRepository } from '../../data/repositories/admin/registerClientRepository';

import { RegisterClientCatalog } from '../../domain/useCases/admin/registerClientCatalogUseCase';

const registerClientApi = new RegisterClientApi();
const registerClientRepository = new RegisterClientRepository(registerClientApi);
export const registerClientCatalogUseCase = new RegisterClientCatalog(registerClientRepository);