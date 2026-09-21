import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import useSummary from '../../../../presentation/viewmodels/collectionRequest/thirdFormViewModel';
import ThirdForm from '../../../../components/organisms/thirdFormRecolectionRequest';
import { CollectionRequestApiClient } from '../../../../data/datasources/collectionRequestApiClient';

jest.mock('../../../../data/datasources/collectionRequestApiClient');
// CRA transforma los SVG de prueba con un formato anterior a React 19.
jest.mock('../../../../components/atoms/Icon', () => () => null);

const sawdust = (cantidad) => ({
    id_producto: 1, cantidad, productos_extra: { nombre: 'Aserrín', precio: 0 },
});
const leaves = { id_producto: 2, cantidad: 1, productos_extra: { nombre: 'Hojas', precio: 50 } };
const methods = [{ id_pago: 1, tipo: 'Efectivo', texto: 'Pago en efectivo', notas: '' }];
let vm;
let getSummary;
let updateTotal;
let deleteProduct;

function response(priceType, bucketCost, products, buckets = 2) {
    return { data: {
        collection: {
            id_solicitud: 'request-1', cubetas_recolectadas: buckets,
            quiere_recoleccion: true, notas: 'Nota guardada',
        },
        priceType, bucketCost, products, balance: 0, payMethods: methods,
        collectionTotal: bucketCost + products.reduce((sum, p) => sum + p.cantidad * p.productos_extra.precio, 0),
    } };
}

function Summary() {
    vm = useSummary('client-1', '2026-09-20', '2026-09-26');
    return <ThirdForm {...vm} total={vm.collectionTotal} reloadSummary={vm.loadSummary} />;
}

beforeEach(() => {
    getSummary = jest.fn();
    updateTotal = jest.fn().mockResolvedValue({ success: true });
    deleteProduct = jest.fn().mockResolvedValue({ success: true });
    CollectionRequestApiClient.mockImplementation(() => ({
        getSummary, updateCollectionTotal: updateTotal, deleteProduct,
    }));
});

test.each([
    ['normal', 90, [sawdust(1)], 1, 1, 0, 90],
    ['pension', 150, [sawdust(2), leaves], 2, 3, 50, 200],
    ['gratis', 0, [], 2, 0, 0, 0],
    ['gratis', 0, [sawdust(2)], 2, 2, 0, 0],
    ['gratis', 0, [leaves], 2, 1, 50, 50],
    ['gratis', 0, [sawdust(2), leaves], 2, 3, 50, 50],
    ['normal_iva', 104.4, [sawdust(1)], 1, 1, 0, 104.4],
    ['pension_iva', 174, [leaves], 2, 1, 50, 224],
    ['gratis', 17, [leaves], 2, 1, 50, 67],
])('%s con tarifa %s y productos %j', async (type, cost, products, buckets, count, subtotal, total) => {
    getSummary.mockResolvedValue(response(type, cost, products, buckets));
    render(<Summary />);
    await screen.findByText('Resumen de compra');

    expect(screen.getByText(`Recolección ${buckets} cubeta${buckets === 1 ? '' : 's'}: $${cost.toFixed(2)}`)).toBeInTheDocument();
    products.forEach(p => expect(screen.getByText(p.productos_extra.nombre)).toBeInTheDocument());
    expect(screen.getByText(`Subtotal ${count} artículo${count === 1 ? '' : 's'}: $${subtotal.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(`Total: $${total.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Forma de pago' })).toBeInTheDocument();
    expect(screen.getByText('Efectivo')).toBeInTheDocument();
    if (type === 'gratis' && cost === 0) {
        expect(screen.getByText(total > 0
            ? 'Tu servicio de recolección es gratis. Solo recuerda realizar el pago de tus productos extra.'
            : 'Tu servicio de recolección es gratis.')).toBeInTheDocument();
        expect(screen.queryByText('No olvides realizar tu pago.')).not.toBeInTheDocument();
    } else {
        expect(screen.getByText('No olvides realizar tu pago.')).toBeInTheDocument();
        expect(screen.queryByText(/Tu servicio de recolección es gratis/)).not.toBeInTheDocument();
    }
    await act(async () => { await vm.saveThirdSection(); });
    expect(updateTotal).toHaveBeenCalledWith('request-1', total, total > 0 ? 1 : null, 'Nota guardada');
});

test('normal → gratis → pension → gratis conserva cubetas, productos, cantidades y notas editadas', async () => {
    const products = [sawdust(2), leaves];
    getSummary.mockResolvedValue(response('normal', 170, products));
    render(<Summary />);
    await screen.findByText('Resumen de compra');
    act(() => vm.setNotes('Conservar esta nota'));
    for (const [type, cost] of [['gratis', 0], ['pension', 150], ['gratis', 0]]) {
        getSummary.mockResolvedValue(response(type, cost, products));
        await act(async () => { await vm.loadSummary(); });
        expect(vm.collection.cubetas_recolectadas).toBe(2);
        expect(vm.products).toEqual(products);
        expect(vm.notes).toBe('Conservar esta nota');
        expect(screen.getByText('Subtotal 3 artículos: $50.00')).toBeInTheDocument();
        expect(vm.collectionTotal).toBe(cost + 50);
    }
});

test('eliminar el último producto con costo actualiza el mensaje y conserva las formas de pago, aserrín y notas', async () => {
    getSummary.mockResolvedValue(response('gratis', 0, [sawdust(2), leaves]));
    render(<Summary />);
    await screen.findByText('Resumen de compra');
    act(() => vm.setNotes('No borrar'));
    getSummary.mockResolvedValue(response('gratis', 0, [sawdust(2)]));
    await act(async () => { await vm.removeProduct(2, 'request-1', 1); });
    expect(screen.getByRole('heading', { name: 'Forma de pago' })).toBeInTheDocument();
    expect(screen.getByText('Tu servicio de recolección es gratis.')).toBeInTheDocument();
    expect(screen.queryByText(/Solo recuerda realizar el pago de tus productos extra/)).not.toBeInTheDocument();
    expect(vm.requiresPayment).toBe(false);
    expect(screen.getByText('Aserrín')).toBeInTheDocument();
    expect(vm.notes).toBe('No borrar');
    expect(deleteProduct).toHaveBeenCalledWith(2, 'request-1', 1);
});

test('guarda una solicitud gratuita aunque no haya métodos de pago', async () => {
    const summary = response('gratis', 0, [sawdust(2)]);
    summary.data.payMethods = [];
    getSummary.mockResolvedValue(summary);
    render(<Summary />);
    await screen.findByText('Resumen de compra');
    await act(async () => { await vm.saveThirdSection(); });
    expect(updateTotal).toHaveBeenCalledWith('request-1', 0, null, 'Nota guardada');
});

test('un error de API no se presenta como resumen de cero y permite reintentar', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});
    getSummary.mockRejectedValue(new Error('Unknown field gratis'));
    render(<Summary />);
    await screen.findByRole('alert');
    expect(screen.queryByText('Resumen de compra')).not.toBeInTheDocument();
    await act(async () => { expect(await vm.saveThirdSection()).toEqual({ success: false }); });
    expect(updateTotal).not.toHaveBeenCalled();
    getSummary.mockResolvedValue(response('gratis', 0, []));
    fireEvent.click(screen.getByText('Volver a cargar resumen'));
    await screen.findByText('Resumen de compra');
    await waitFor(() => expect(vm.error).toBeNull());
    log.mockRestore();
});
