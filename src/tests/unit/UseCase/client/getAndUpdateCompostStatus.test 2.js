import { GetCompostStatusUseCase } from '../../../../domain/useCases/GetCompostStatusUseCase';
import { UpdateCompostStatusUseCase } from '../../../../domain/useCases/updateCompostStatusUseCase';


describe('GetCompostStatusUseCase', () => {
    let repository;
    let useCase;

    beforeEach(() => {
        repository = {
            getCompostStatus: jest.fn(),
        };

        useCase = new GetCompostStatusUseCase(repository);
    });

    it('debe obtener el estatus true de la composta correctamente', async () => {
        repository.getCompostStatus.mockResolvedValue(true);

        const result = await useCase.execute();

        expect(repository.getCompostStatus).toHaveBeenCalledTimes(1);
        expect(result).toBe(true);
    });

    it('debe obtener el estatus false de la composta correctamente', async () => {
        repository.getCompostStatus.mockResolvedValue(false);

        const result = await useCase.execute();

        expect(repository.getCompostStatus).toHaveBeenCalledTimes(1);
        expect(result).toBe(false);
    });

    it('debe lanzar error si el repository falla', async () => {
        repository.getCompostStatus.mockRejectedValue(new Error('Error al obtener estatus'));

        await expect(useCase.execute()).rejects.toThrow('Error al obtener estatus');
    });
});


describe('UpdateCompostStatusUseCase', () => {
    let repository;
    let useCase;

    beforeEach(() => {
        repository = {
            updateCompostStatus: jest.fn(),
        };

        useCase = new UpdateCompostStatusUseCase(repository);
    });

    it('debe actualizar el estatus de la composta correctamente', async () => {
        repository.updateCompostStatus.mockResolvedValue({
            count: 2,
        });

        const result = await useCase.execute(false);

        expect(repository.updateCompostStatus).toHaveBeenCalledTimes(1);
        expect(repository.updateCompostStatus).toHaveBeenCalledWith(false);
        expect(result).toEqual({
            count: 2,
        });
    });

    it('debe lanzar error si el repository falla al actualizar', async () => {
        repository.updateCompostStatus.mockRejectedValue(new Error('Error al actualizar estatus'));

        await expect(useCase.execute(true)).rejects.toThrow('Error al actualizar estatus');
    });

    it('debe actualizar el estatus de la composta a true correctamente', async () => {
        repository.updateCompostStatus.mockResolvedValue({
            count: 2,
        });

        const result = await useCase.execute(true);

        expect(repository.updateCompostStatus).toHaveBeenCalledTimes(1);
        expect(repository.updateCompostStatus).toHaveBeenCalledWith(true);
        expect(result).toEqual({
            count: 2,
        });
    });
});