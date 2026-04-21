import { AuthApiClient } from '../../data/datasources/authApiClient';
import { AuthRepository } from '../../data/repositories/authRepository';
import { LoginUseCase } from '../../domain/useCases/loginUseCase';

// 1. Instanciamos el cliente API (Capa de Infraestructura)
const authApiClient = new AuthApiClient();

// 2. Inyectamos el cliente en el repositorio (Capa de Datos)
const authRepository = new AuthRepository(authApiClient);

// 3. Inyectamos el repositorio en el caso de uso (Capa de Dominio)
// Exportamos instancias listas para usar (Singletons)
export const loginUseCase = new LoginUseCase(authRepository);
