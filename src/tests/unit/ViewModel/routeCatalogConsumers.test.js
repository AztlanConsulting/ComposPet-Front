import { act, renderHook, waitFor } from '@testing-library/react';
import useClientTableViewModel from '../../../presentation/viewmodels/clientTableViewModel';
import useRoutesViewModel from '../../../presentation/viewmodels/routesInfo/routesTable';
import useRegisterClientCatalogViewModel from '../../../presentation/viewmodels/admin/registerClientCatalogViewModel';
import * as clientDependencies from '../../../di/admin/clientTableDependencies';
import * as routeUseCases from '../../../domain/useCases/routesInfo/routesTableUseCase';

jest.mock('../../../di/admin/clientTableDependencies', () => ({
    getTableUseCase: { execute: jest.fn() },
    getRoutesUseCase: { execute: jest.fn() },
    updateClientUseCase: { execute: jest.fn() },
    getCompostStatusUseCase: { execute: jest.fn() },
    updateCompostStatusUseCase: { execute: jest.fn() },
    getEmailsUseCase: { execute: jest.fn() },
}));
jest.mock('../../../domain/useCases/routesInfo/routesTableUseCase', () => ({
    GetRoutesInfoUseCase: jest.fn(),
    GetAvailableWeeksUseCase: jest.fn(),
    GetDaysOfRoutesUseCase: jest.fn(),
    GetFilteredRoutesUseCase: jest.fn(),
    GetDataForEditingRequestUseCase: jest.fn(),
    UpdateRequestUseCase: jest.fn(),
    ExportFilteredRoutesUseCase: jest.fn(),
}));
jest.mock('../../../domain/useCases/routesInfo/generateRouteMessagesUseCase', () => ({
    GenerateRouteMessagesUseCase: jest.fn(() => ({ execute: jest.fn() })),
}));
jest.mock('../../../components/Template/ProblemAlert', () => jest.fn());
jest.mock('../../../components/Template/AceptAlert', () => jest.fn());

// Respuesta ya ordenada del backend. Los IDs, sufijos y turnos no la reordenan.
const catalog = Object.freeze([
    { id_ruta: 9, dia_ruta: 'Lunes - B', orden: 1 },
    { id_ruta: 8, dia_ruta: 'Ruta: MIÉRCOLES - Z', orden: 2, turno_ruta: 'Tarde' },
    { id_ruta: 3, dia_ruta: 'Miércoles 1', orden: 3, turno_ruta: 'Mañana' },
    { id_ruta: 11, dia_ruta: 'Jueves - B', orden: 4 },
    { id_ruta: 6, dia_ruta: 'Jueves 1', orden: 5 },
    { id_ruta: 30, dia_ruta: 'Sábado', orden: 6 },
    { id_ruta: 31, dia_ruta: 'Domingo', orden: 7 },
].map(Object.freeze));

let mockFiltered;
let mockDays;

beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2026, 9, 28, 12)); // Miércoles en hora local.
    clientDependencies.getTableUseCase.execute.mockResolvedValue([
        { clientId: 'b', routeId: 8 },
        { clientId: 'a', routeId: 3 },
    ]);
    clientDependencies.getRoutesUseCase.execute.mockResolvedValue(catalog);
    clientDependencies.getCompostStatusUseCase.execute.mockResolvedValue({ status: { data: false } });
    mockFiltered = jest.fn().mockResolvedValue([]);
    mockDays = jest.fn().mockResolvedValue(catalog);
    routeUseCases.GetAvailableWeeksUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue([{
            weekStart: new Date(2026, 9, 26), weekEnd: new Date(2026, 10, 2),
        }]),
    }));
    routeUseCases.GetDaysOfRoutesUseCase.mockImplementation(() => ({ execute: mockDays }));
    routeUseCases.GetFilteredRoutesUseCase.mockImplementation(() => ({ execute: mockFiltered }));
    routeUseCases.GetRoutesInfoUseCase.mockImplementation(() => ({ execute: jest.fn() }));
    routeUseCases.GetDataForEditingRequestUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue({ payMethods: [], extraProducts: [] }),
    }));
    routeUseCases.UpdateRequestUseCase.mockImplementation(() => ({ execute: jest.fn() }));
    routeUseCases.ExportFilteredRoutesUseCase.mockImplementation(() => ({ execute: jest.fn() }));
});

afterEach(() => {
    jest.useRealTimers();
});

it('conserva el catálogo en filtro y editor, con Sin filtro primero y las filas intactas', async () => {
    const { result, rerender } = renderHook(() => useClientTableViewModel());
    await waitFor(() => expect(result.current.routesDropdown).toHaveLength(catalog.length + 1));

    expect(result.current.routesDropdown).toEqual([
        { value: '', label: 'Sin filtro' },
        ...catalog.map(route => ({ value: route.id_ruta, label: route.dia_ruta })),
    ]);
    const routeColumn = result.current.columnDefinitions.find(column => column.field === 'routeId');
    expect(routeColumn.cellEditorParams.values).toEqual(catalog.map(route => route.id_ruta));
    expect(result.current.clientList.map(client => client.clientId)).toEqual(['b', 'a']);

    await act(async () => result.current.setSelectedRoute(3));
    rerender();
    expect(result.current.selectedRoute).toBe(3);
    expect(result.current.clientList.map(client => client.clientId)).toEqual(['a']);
    await act(async () => result.current.setSelectedRoute(''));
    expect(result.current.clientList.map(client => client.clientId)).toEqual(['b', 'a']);
});

it('el registro conserva el orden recibido y el ID seleccionado', async () => {
    const useCase = { execute: jest.fn().mockResolvedValue({ daysOfRoutes: catalog }) };
    const { result, rerender } = renderHook(() => useRegisterClientCatalogViewModel(useCase));
    await waitFor(() => expect(result.current.daysOfRoutes).toBe(catalog));
    act(() => result.current.handleDayOfRouteChange(3));
    rerender();
    expect(result.current.selectedDay).toBe(3);
    expect(result.current.daysOfRoutes).toBe(catalog);
});

it('la vista de Ruta conserva el catálogo y elige la primera ruta de hoy, sin preferir el sufijo 1', async () => {
    const { result, rerender } = renderHook(() => useRoutesViewModel());
    await waitFor(() => expect(result.current.selectedDay).toBe('Ruta: MIÉRCOLES - Z'));
    expect(result.current.daysOfRoutes).toBe(catalog);
    expect(mockFiltered).toHaveBeenCalledWith(0, 'Ruta: MIÉRCOLES - Z');
    await act(async () => result.current.setSelectedDay('Miércoles 1'));
    rerender();
    expect(result.current.selectedDay).toBe('Miércoles 1');
    expect(result.current.daysOfRoutes).toBe(catalog);
});

it('Mañana busca el día siguiente y respeta su primera ruta configurada', async () => {
    const { result } = renderHook(() => useRoutesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => result.current.resetFilters());
    expect(result.current.selectedDay).toBe('Jueves - B');
    expect(mockFiltered).toHaveBeenCalledWith(0, 'Jueves - B');
});

it.each([
    [30, 2026, 9, 31, 'Sábado'],
    [31, 2026, 10, 1, 'Domingo'],
    [null, 2026, 9, 27, null],
])('selecciona el día solicitado, incluyendo fin de semana y días sin rutas (%s)', async (_, year, month, day, expected) => {
    jest.setSystemTime(new Date(year, month, day, 12));
    const { result } = renderHook(() => useRoutesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.selectedDay).toBe(expected);
});

it.each([[catalog], [[...catalog].reverse()]])('los totales semanales no dependen de las posiciones del catálogo', async (days) => {
    mockDays.mockResolvedValue(days);
    mockFiltered.mockImplementation(async (_week, day) => [{
        name: day, totalToPay: 30, totalPaid: 10,
    }]);
    const { result } = renderHook(() => useRoutesViewModel());
    await waitFor(() => expect(result.current.weeklyPayedAmount).toBe('$70.00'));
    expect(result.current.weeklyPendingAmount).toBe('$140.00');
});

it.each([[2026, 9, 31], [2026, 10, 1]])('un fin de semana sin rutas muestra la tabla vacía (%s-%s-%s)', async (year, month, day) => {
    jest.setSystemTime(new Date(year, month, day, 12));
    mockDays.mockResolvedValue(catalog.filter(route => !['Sábado', 'Domingo'].includes(route.dia_ruta)));
    // Una consulta sin día devolvería filas del día por defecto del API.
    mockFiltered.mockImplementation(async (_week, name) => [{ name: name ?? 'Día por defecto' }]);

    const { result } = renderHook(() => useRoutesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.selectedDay).toBeNull();
    expect(result.current.routesList).toEqual([]);
    expect(mockFiltered.mock.calls.every(([, name]) => Boolean(name))).toBe(true);
    expect(result.current.error).toBeNull();
});

it.each([
    [2026, 9, 30, 'Sábado'],
    [2026, 9, 31, 'Domingo'],
])('Mañana limpia las filas si no hay rutas para %s-%s-%s: %s', async (year, month, day, missingDay) => {
    jest.setSystemTime(new Date(year, month, day, 12));
    const days = [
        ...catalog.slice(0, 5),
        { id_ruta: 40, dia_ruta: 'Viernes', orden: 8 },
        ...catalog.slice(5),
    ].filter(route => route.dia_ruta !== missingDay);
    mockDays.mockResolvedValue(days);
    mockFiltered.mockImplementation(async (_week, name) => [{ name: name ?? 'Día por defecto' }]);

    const { result } = renderHook(() => useRoutesViewModel());
    await waitFor(() => expect(result.current.routesList).toHaveLength(1));
    await act(async () => result.current.resetFilters());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.selectedDay).toBeNull();
    expect(result.current.routesList).toEqual([]);
    expect(mockFiltered.mock.calls.every(([, name]) => Boolean(name))).toBe(true);
    expect(result.current.error).toBeNull();
});
