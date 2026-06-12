import { AdminProfileApi } from '../../data/datasources/admin/adminProfileApi';
import { AdminProfileRepository } from '../../data/repositories/admin/adminProfileRepository';

import { GetAdminProfileUseCase, UpdateAdminProfileUseCase } from '../../domain/useCases/admin/adminProfileUseCase';

const adminProfileApi = new AdminProfileApi();
const adminProfileRepository = new AdminProfileRepository(adminProfileApi);

export const adminProfileUseCase = new GetAdminProfileUseCase(adminProfileRepository);
export const updateAdminProfileUseCase = new UpdateAdminProfileUseCase(adminProfileRepository);