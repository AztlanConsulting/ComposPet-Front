import { useCallback, useEffect, useState, useMemo } from "react";
import { GetClientTableUseCase } from "../../domain/useCases/getClientTableUseCase";
import { ClientTableRepository } from "../../data/repositories/clientTableRepository";
import { ClientApiClient } from "../../data/datasources/clientApiClient";

import { getClientTableColumns } from "./utils/clientTableColumnDefinitions";

/**
 * ViewModel para la tabla de información de clientes de Compospet
 *
 * @returns {object} Estado de carga e información
 */
function useClientTableViewModel() {

    // Estados para manejar la edición 
    const [editingRowId, setEditingRowId] = useState(null);
    const [originalClientList, setOriginalClientList] = useState([]);


    const [clientList, setClientList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [routeList, setRouteList] = useState([]);

    const getTableUseCase = useMemo(() => {
        const datasource = new ClientApiClient();
        const repository = new ClientTableRepository(datasource);
        return new GetClientTableUseCase(repository);
    }, []);

    const getInfo = useCallback( async () => {

        if (loading) return;

        try {
            setLoading(true);

            const response = await getTableUseCase.execute();
            setClientList(response);
            setOriginalClientList(JSON.parse(JSON.stringify(response)));

        } catch (error) {
            console.log("Error loading client data: ", error);
        } finally {
            setLoading(false);
        }
    }, [getTableUseCase]);

    useEffect(() => {
        getInfo();
    }, []);

    const isCellChanged = useCallback((params) => {
        const rowId = params.data.clientId;
        const field = params.colDef.field;

        const originalRow = originalClientList.find(c => c.clientId === rowId);

        if (!originalRow) return false;

        return originalRow[field] !== params.value;
    }, [originalClientList]);

    const handleEdit = useCallback((params) => {

        if (editingRowId !== null) return;

        setEditingRowId(params.data.clientId);

        setTimeout(() => {
            params.api.startEditingCell({
                rowIndex: params.node.rowIndex,
                colKey: 'balance', 
            });
        });
    }, []);

    const handleCancel = useCallback((params) => {
        const rowId = params.data.clientId;

        const originalRow = originalClientList.find(r => r.clientId === rowId);

        if(!originalRow) return;

        params.node.setData({...originalRow});

        setEditingRowId(null);

        params.api.refreshCells({force: true});
    }, [originalClientList]);

    const handleSave = useCallback((params) => {
        const updatedData = params.data;
        console.log("Guardar:", updatedData);
        setEditingRowId(null);
    }, []);

    // AG Table columns config
    const columnDefinitions = useMemo(() => 
        getClientTableColumns({
            editingRowId,
            handleEdit,
            handleSave,
            handleCancel,
            isCellChanged,
            routeList,
        }),
    [editingRowId, handleEdit, handleSave, handleCancel, isCellChanged]);

    const defaultColDef = useMemo(() => ({
        filter: true,
        sortable: true,
        resizable: true,
        floatingFilter: true,
        tooltipValueGetter: (params) => params.value,
    }), []);

    return {
        clientList,
        loading,
        columnDefinitions,
        defaultColDef,
        editingRowId,
    };
}

export default useClientTableViewModel;