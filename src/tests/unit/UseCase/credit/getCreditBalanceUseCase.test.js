import { GetCreditBalanceUseCase } from "../../../../domain/useCases/getCreditBalanceUseCase";

describe("GetCreditBalanceUseCase", () => {
    test("debe obtener el saldo del cliente", async () => {
    // Arrange
        //Respuesta moqueada del repositorio
        const mockCreditBalance = { saldo: 500 };

        //Creamos un repositorio falso
        const mockRepo = {
            getCreditBalance: jest.fn().mockResolvedValue(mockCreditBalance),
        };

        //Creamos el caso de uso y le pasamos el repositorio mockeado
        const useCase = new GetCreditBalanceUseCase(mockRepo);

        // Actuar con un id de cliente prueba
        const result = await useCase.execute("clientId");

        // Afirmar que el repo due llamado con el cliente correcto
        expect(mockRepo.getCreditBalance).toHaveBeenCalledWith("clientId");
        expect(result).toEqual(mockCreditBalance);
    });

    test("debe lanzar error si no se envía clientId", async () => {
        // Arrange Preparamos 
        const mockRepo = {
        getCreditBalance: jest.fn(),
        };

        const useCase = new GetCreditBalanceUseCase(mockRepo);

        // Actuar
        await expect(useCase.execute()).rejects.toThrow("Falta el id del usuario");
        
        // Afirmar que el repositorio no se llamo.
        expect(mockRepo.getCreditBalance).not.toHaveBeenCalled();
    });
});