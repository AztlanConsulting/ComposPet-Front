import { RegisterClient } from '../../../domain/useCases/admin/registerClientUseCase';

describe('RegisterClient Use Case', () => {

    test('debe transformar los datos correctamente', async () => {

        const mockRepository = {
            postRegisterClient: jest.fn().mockResolvedValue("ok")
        };

        const useCase = new RegisterClient(mockRepository);

        const data = {
            name: "Juan",
            lastname1: "Pérez",
            lastname2: "López",
            email: "juan@test.com",
            phone: "4421234567",
            address: "Calle 123",
            selectedDay: 1,
            pets: "",
            family: "",
            notes: ""
        };

        await useCase.execute(data);

        expect(mockRepository.postRegisterClient).toHaveBeenCalledWith({
            name: "Juan",
            lastName: "Pérez López",
            email: "juan@test.com",
            phone: "4421234567",
            pets: "",
            family: "",
            notes: "",
            address: "Calle 123",
            id_ruta: 1
        });
    });

});