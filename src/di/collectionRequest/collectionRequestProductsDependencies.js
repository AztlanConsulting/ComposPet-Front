import { CollectionRequestApiClient } from '../../data/datasources/collectionRequestApiClient';
import { CollectionRequestRepository } from '../../data/repositories/collectionRequestRepository';

import { ExtraProductsUseCase } from '../../domain/useCases/ExtraProducts';
import { SaveExtraProductsCollection } from '../../domain/useCases/saveExtraProductsCollection';
import { GetLastRequestPerClient } from '../../domain/useCases/getLastRequestPerClient';
import { ExtraProductRequestCollection } from '../../domain/useCases/extraProductRequestCollection';

const collectionRequestApiClient = new CollectionRequestApiClient();
const collectionRequestRepository = new CollectionRequestRepository(collectionRequestApiClient);

export const extraProductsUseCase = new ExtraProductsUseCase(collectionRequestRepository);
export const saveExtraProductsUseCase = new SaveExtraProductsCollection(collectionRequestRepository);
export const getLastRequestPerClientUseCase = new GetLastRequestPerClient(collectionRequestRepository);
export const getSelectedExtraProductsUseCase = new ExtraProductRequestCollection(collectionRequestRepository);