import { renderHook } from '@testing-library/react';
import useRoutesViewModel from '../../../../presentation/viewmodels/routesInfo/routesTable';
import { GetRoutesInfoUseCase } from '../../../../domain/useCases/routesInfo/routesTableUseCase';

jest.mock('../../../../domain/useCases/routesInfo/routesTableUseCase', () => ({
    GetRoutesInfoUseCase:     jest.fn(),
    GetAvailableWeeksUseCase: jest.fn(),
    GetDaysOfRoutesUseCase:   jest.fn(),
    GetFilteredRoutesUseCase: jest.fn(),
}));

describe('useRoutesViewModel - copyLinkInfo', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        GetRoutesInfoUseCase.mockImplementation(() => ({
            execute: jest.fn().mockResolvedValue([]),
        }));
    });

    it('debe regresar la información del CopyLink correctamente', () => {
        const { result } = renderHook(() => useRoutesViewModel());

        expect(result.current.copyLinkInfo).toEqual({
            text: 'Formulario de recolección',
            link: `¡Excelente día!

*¿Te anotamos para recolección mañana?* 🪣🚛
Apóyanos contestando el formulario de recolección de nuestra página https://www.compospetmx.org/formulario-recoleccion para registrar tu recolección 🫶🏼`,
            bubbleMessage: '¡Copiado!',
        });
    });
});