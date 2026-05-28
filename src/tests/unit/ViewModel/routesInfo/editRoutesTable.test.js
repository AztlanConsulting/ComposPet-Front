import { renderHook, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import useRoutesViewModel from '../../../../presentation/viewmodels/routesInfo/routesTable';
import {
    GetRoutesInfoUseCase,
    GetAvailableWeeksUseCase,
    GetDaysOfRoutesUseCase,
    GetFilteredRoutesUseCase,
    GetDataForEditingRequestUseCase,
    UpdateRequestUseCase,
} from '../../../../domain/useCases/routesInfo/routesTableUseCase';

jest.mock('../../../../domain/useCases/routesInfo/routesTableUseCase', () => ({
    GetRoutesInfoUseCase:            jest.fn(),
    GetAvailableWeeksUseCase:        jest.fn(),
    GetDaysOfRoutesUseCase:          jest.fn(),
    GetFilteredRoutesUseCase:        jest.fn(),
    GetDataForEditingRequestUseCase: jest.fn(),
    UpdateRequestUseCase:            jest.fn(),
}));

jest.mock('../../../../components/Template/ProblemAlert', () =>
    jest.fn().mockResolvedValue(undefined)
);

jest.mock('../../../../components/Template/AceptAlert', () =>
    jest.fn().mockResolvedValue(undefined)
);

const MOCK_ROUTES = [
    {
        name: 'Juan Manuel M',
        collectedBuckets: 2,
        deliveredBuckets: 3,
        payMethod: { id_pago: 1, tipo: 'Efectivo' },
        hasRequest: true,
        status: true,
        wantsCollection: true,
        wantsExtraProducts: true,
    },
    {
        name: 'Armando Gonzalez',
        collectedBuckets: 0,
        deliveredBuckets: 1,
        payMethod: { id_pago: 2, tipo: 'Transferencia' },
        hasRequest: true,
        status: true,
        wantsCollection: true,
        wantsExtraProducts: false,
    },
];

const MOCK_WEEK = {
    weekStart: new Date(Date.now() - 86400000),
    weekEnd:   new Date(Date.now() + 6 * 86400000),
    label:     'Semana actual',
};

function makeParams(route, overrides = {}) {
    return {
        data: { ...route },
        node: {
            rowIndex: 0,
            setData:  jest.fn(),
            data:     { ...route },
        },
        api: {
            startEditingCell: jest.fn(),
            stopEditing:      jest.fn(),
            refreshCells:     jest.fn(),
            redrawRows: jest.fn(),
        },
        colDef: { field: 'collectedBuckets' },
        value:  route.collectedBuckets,
        ...overrides,
    };
}

async function mountHook() {
    const { result } = renderHook(() => useRoutesViewModel());
    await waitFor(() => expect(result.current.loading).toBe(false));
    return result;
}

let mockExecuteFiltered;
let mockExecuteUpdate;

beforeEach(() => {
    jest.clearAllMocks();

    mockExecuteFiltered = jest.fn().mockResolvedValue([...MOCK_ROUTES]);
    mockExecuteUpdate   = jest.fn().mockResolvedValue(undefined);

    GetAvailableWeeksUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue([MOCK_WEEK]),
    }));
    GetDaysOfRoutesUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue([]),
    }));
    GetRoutesInfoUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue([]),
    }));
    GetFilteredRoutesUseCase.mockImplementation(() => ({
        execute: mockExecuteFiltered,
    }));
    GetDataForEditingRequestUseCase.mockImplementation(() => ({
        execute: jest.fn().mockResolvedValue({
            payMethods:    [{ id_pago: 1, tipo: 'Efectivo' }],
            extraProducts: [],
        }),
    }));
    UpdateRequestUseCase.mockImplementation(() => ({
        execute: mockExecuteUpdate,
    }));
});

describe('handleEdit', () => {

    it('llama a startEditingCell cuando se edita una fila', async () => {
        const result = await mountHook();

        const editColRenderer = result.current.columnDefinitions[0].cellRenderer;
        const params = makeParams(MOCK_ROUTES[0]);

        const rendered = editColRenderer(params);
        const onClickEdit = rendered.props.children.props.onClick;

        act(() => { onClickEdit(); });

        await waitFor(() => {
            expect(params.api.startEditingCell).toHaveBeenCalledWith({
                rowIndex: params.node.rowIndex,
                colKey:   'collectedBuckets',
            });
        });
    });

    it('no llama a startEditingCell si ya hay otra fila en edición', async () => {
        const result = await mountHook();

        const editColRenderer = result.current.columnDefinitions[0].cellRenderer;
        const params1 = makeParams(MOCK_ROUTES[0]);
        const params2 = makeParams(MOCK_ROUTES[1], {
            node: { rowIndex: 1, setData: jest.fn(), data: MOCK_ROUTES[1] },
            api:  { startEditingCell: jest.fn(), stopEditing: jest.fn(), refreshCells: jest.fn(), redrawRows: jest.fn(), },
        });

        const rendered1 = editColRenderer(params1);
        act(() => { rendered1.props.children.props.onClick(); });
        await waitFor(() => expect(params1.api.startEditingCell).toHaveBeenCalledTimes(1));

        const rendered2 = result.current.columnDefinitions[0].cellRenderer(params2);
        const editButton2 = rendered2.props.children.props;

        expect(editButton2.disabled).toBe(true);
    });

});

describe('handleCancel', () => {

    it('restaura los datos originales de la fila y detiene la edición', async () => {
        const result = await mountHook();

        const editColRenderer = result.current.columnDefinitions[0].cellRenderer;
        const params = makeParams(MOCK_ROUTES[0]);

        const renderedIdle = editColRenderer(params);
        act(() => { renderedIdle.props.children.props.onClick(); });
        await waitFor(() => expect(params.api.startEditingCell).toHaveBeenCalled());

        const renderedEditing = result.current.columnDefinitions[0].cellRenderer(params);
        const onClickCancel = renderedEditing.props.children[1].props.onClick;

        act(() => { onClickCancel(); });

        await waitFor(() => {
            expect(params.api.stopEditing).toHaveBeenCalled();
            expect(params.node.setData).toHaveBeenCalledWith(
                expect.objectContaining({ name: MOCK_ROUTES[0].name })
            );
        });
    });

    it('no falla si la fila no existe en originalRoutesList', async () => {
        const result = await mountHook();

        const editColRenderer = result.current.columnDefinitions[0].cellRenderer;
        const params = makeParams(MOCK_ROUTES[0]);
        act(() => { editColRenderer(params).props.children.props.onClick(); });
        await waitFor(() => expect(params.api.startEditingCell).toHaveBeenCalled());

        const renderedEditing = result.current.columnDefinitions[0].cellRenderer(params);
        const onClickCancel = renderedEditing.props.children[1].props.onClick;

        renderedEditing.props.children[1].props.onClick.call(null);

        expect(() => {
            act(() => { onClickCancel(); });
        }).not.toThrow();
    });

});

describe('handleSave', () => {

    it('llama a UpdateRequestUseCase y recarga las rutas al guardar', async () => {
        const result = await mountHook();
        const params = makeParams(MOCK_ROUTES[0]);

        const editColRenderer = result.current.columnDefinitions[0].cellRenderer;
        act(() => { editColRenderer(params).props.children.props.onClick(); });
        await waitFor(() => expect(params.api.startEditingCell).toHaveBeenCalled());

        const renderedEditing = result.current.columnDefinitions[0].cellRenderer(params);
        const onClickSave = renderedEditing.props.children[0].props.onClick;

        await act(async () => { await onClickSave(); });

        expect(mockExecuteUpdate).toHaveBeenCalledWith(
            expect.objectContaining({ name: MOCK_ROUTES[0].name })
        );
        expect(mockExecuteFiltered).toHaveBeenCalledTimes(3);
        expect(params.api.stopEditing).toHaveBeenCalled();
    });

    it('muestra ProblemAlert con el mensaje del error si UpdateRequestUseCase falla', async () => {
        const ProblemAlert = require('../../../../components/Template/ProblemAlert');
        const errorMessage = 'Error de red al guardar';
        mockExecuteUpdate.mockRejectedValueOnce(new Error(errorMessage));

        const result = await mountHook();
        const params = makeParams(MOCK_ROUTES[0]);

        const editColRenderer = result.current.columnDefinitions[0].cellRenderer;
        act(() => { editColRenderer(params).props.children.props.onClick(); });
        await waitFor(() => expect(params.api.startEditingCell).toHaveBeenCalled());

        const renderedEditing = result.current.columnDefinitions[0].cellRenderer(params);
        const onClickSave = renderedEditing.props.children[0].props.onClick;

        await act(async () => { await onClickSave(); });

        expect(ProblemAlert).toHaveBeenCalledWith(
            expect.objectContaining({ text: errorMessage })
        );
        expect(result.current.routesList).toBeDefined();
    });

    it('loading vuelve a false aunque UpdateRequestUseCase falle', async () => {
        mockExecuteUpdate.mockRejectedValueOnce(new Error('fallo'));

        const result = await mountHook();
        const params = makeParams(MOCK_ROUTES[0]);

        const editColRenderer = result.current.columnDefinitions[0].cellRenderer;
        act(() => { editColRenderer(params).props.children.props.onClick(); });
        await waitFor(() => expect(params.api.startEditingCell).toHaveBeenCalled());

        const renderedEditing = result.current.columnDefinitions[0].cellRenderer(params);
        const onClickSave = renderedEditing.props.children[0].props.onClick;

        await act(async () => { await onClickSave(); });

        await waitFor(() => expect(result.current.loading).toBe(false));
    });

});

describe('isCellChanged', () => {

    function getCellChangedFn(columnDefinitions, fieldName) {
        const col = columnDefinitions.find(c => c.field === fieldName);

        return col.cellClassRules['cell-modified'];
    }

    it('devuelve false si el valor no ha cambiado respecto al original', async () => {
        const result = await mountHook();
        const isChanged = getCellChangedFn(result.current.columnDefinitions, 'collectedBuckets');

        const params = {
            data:   { ...MOCK_ROUTES[0] },
            colDef: { field: 'collectedBuckets' },
            value:  MOCK_ROUTES[0].collectedBuckets,
        };

        expect(isChanged(params)).toBe(false);
    });

    it('devuelve true si el valor cambió respecto al original', async () => {
        const result = await mountHook();
        await waitFor(() => expect(result.current.routesList.length).toBeGreaterThan(0));
        const isChanged = getCellChangedFn(result.current.columnDefinitions, 'collectedBuckets');

        const params = {
            data:   { ...MOCK_ROUTES[0] },
            colDef: { field: 'collectedBuckets' },
            value:  999,
        };

        expect(isChanged(params)).toBe(true);
    });

    it('compara objetos por valor (JSON), no por referencia', async () => {
        const result = await mountHook();
        await waitFor(() => expect(result.current.routesList.length).toBeGreaterThan(0));
        const isChanged = getCellChangedFn(result.current.columnDefinitions, 'collectedBuckets');

        const paramsSame = {
            data:   { ...MOCK_ROUTES[0] },
            colDef: { field: 'payMethod' },
            value:  { ...MOCK_ROUTES[0].payMethod },
        };
        expect(isChanged(paramsSame)).toBe(false);

        const paramsDiff = {
            data:   { ...MOCK_ROUTES[0] },
            colDef: { field: 'payMethod' },
            value:  { id_pago: 99, tipo: 'Otro' },
        };
        expect(isChanged(paramsDiff)).toBe(true);
    });

    it('devuelve false si la fila no existe en originalRoutesList', async () => {
        const result = await mountHook();
        const isChanged = getCellChangedFn(result.current.columnDefinitions, 'collectedBuckets');

        const params = {
            data:   { name: 'Fila inexistente' },
            colDef: { field: 'collectedBuckets' },
            value:  5,
        };

        expect(isChanged(params)).toBe(false);
    });

});

describe('canChangeFilters con cambios pendientes', () => {

    it('muestra ProblemAlert e impide cambiar de semana si hay una edición activa', async () => {
        const ProblemAlert = require('../../../../components/Template/ProblemAlert');
        const result = await mountHook();
        const params = makeParams(MOCK_ROUTES[0]);

        const editColRenderer = result.current.columnDefinitions[0].cellRenderer;
        act(() => { editColRenderer(params).props.children.props.onClick(); });
        await waitFor(() => expect(params.api.startEditingCell).toHaveBeenCalled());

        const prevWeek = result.current.selectedWeek;

        await act(async () => { await result.current.setSelectedWeek(99); });

        expect(ProblemAlert).toHaveBeenCalled();
        expect(result.current.selectedWeek).toBe(prevWeek);
    });

    it('muestra ProblemAlert e impide cambiar de día si hay una edición activa', async () => {
        const ProblemAlert = require('../../../../components/Template/ProblemAlert');
        const result = await mountHook();
        const params = makeParams(MOCK_ROUTES[0]);

        const editColRenderer = result.current.columnDefinitions[0].cellRenderer;
        act(() => { editColRenderer(params).props.children.props.onClick(); });
        await waitFor(() => expect(params.api.startEditingCell).toHaveBeenCalled());

        const prevDay = result.current.selectedDay;

        await act(async () => { await result.current.setSelectedDay('Martes'); });

        expect(ProblemAlert).toHaveBeenCalled();
        expect(result.current.selectedDay).toBe(prevDay);
    });

    it('permite cambiar de semana si no hay cambios pendientes', async () => {
        const result = await mountHook();

        await act(async () => { await result.current.setSelectedWeek(0); });

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.selectedWeek).toBe(0);
    });

});