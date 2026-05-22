import { renderHook, act } from '@testing-library/react';
import useRoutesViewModel from '../../../../presentation/viewmodels/routesInfo/routesTable';

describe('useRoutesViewModel - handleOpenRoutesSheet', () => {
    const originalEnv = process.env;
    const originalWindowOpen = window.open;
    const originalConsoleError = console.error;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };

        window.open = jest.fn();
        console.error = jest.fn();
    });

    afterAll(() => {
        process.env = originalEnv;
        window.open = originalWindowOpen;
        console.error = originalConsoleError;
    });

    it('debe abrir la URL en una nueva pestaña si la variable de entorno está configurada', () => {
        const mockUrl = 'https://docs.google.com/spreadsheets/d/mock-id';
        process.env.REACT_APP_SHEETS_ROUTES_URL = mockUrl;
        
        const { result } = renderHook(() => useRoutesViewModel());

        act(() => {
            result.current.handleOpenRoutesSheet();
        });

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(mockUrl, '_blank', 'noopener,noreferrer');
        expect(console.error).not.toHaveBeenCalled();
    });

    it('debe imprimir un error en consola y no abrir la ventana si la variable no está configurada', () => {
        delete process.env.REACT_APP_SHEETS_ROUTES_URL;
        
        const { result } = renderHook(() => useRoutesViewModel());

        act(() => {
            result.current.handleOpenRoutesSheet();
        });

        expect(console.error).toHaveBeenCalledTimes(1);
        expect(console.error).toHaveBeenCalledWith("URL de Google Sheets no configurada");
        expect(window.open).not.toHaveBeenCalled();
    });
});