import { useCallback, useEffect, useState, useMemo } from "react";

// CLI-03
import { GetClientTableUseCase } from "../../domain/useCases/getClientTableUseCase";
import { ClientTableRepository } from "../../data/repositories/clientTableRepository";
import { ClientApiClient } from "../../data/datasources/clientApiClient";

// CLI-07
import { GetRoutesUseCase } from "../../domain/useCases/getRoutesUseCase";
import { UpdateClientUseCase } from "../../domain/useCases/updateClientUseCase";
import { UpdateClientRepository } from "../../data/repositories/updateClientRepository";

import { getClientTableColumns } from "./utils/clientTableColumnDefinitions";
import ProblemAlert from "../../components/Template/ProblemAlert";
import AceptAlert from "../../components/Template/AceptAlert";

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

    const routeOptions = routeList.map(r => r.id_ruta);
    const routeMap = Object.fromEntries(
        routeList.map(r => [r.id_ruta, r.dia_ruta])
    );

    const getTableUseCase = useMemo(() => {
        const datasource = new ClientApiClient();
        const repository = new ClientTableRepository(datasource);
        return new GetClientTableUseCase(repository);
    }, []);

    const getRoutesUseCase = useMemo(() => {
        const datasource = new ClientApiClient();
        const repository = new UpdateClientRepository(datasource);
        return new GetRoutesUseCase(repository);
    }, []);

    const updateClientUseCase = useMemo(() => {
        const datasource = new ClientApiClient();
        const repository = new UpdateClientRepository(datasource);
        return new UpdateClientUseCase(repository);
    }, []);

    const getRoutes = useCallback( async () => {
        if (loading) return;

        try{
            setLoading(true);

            const response = await getRoutesUseCase.execute();
            setRouteList(response);

        } catch (error) {
            console.log("Error loading routes list: ", error);
        } finally {
            setLoading(false);
        }
    }, [getRoutesUseCase]);

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
        getRoutes();
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
    }, [editingRowId]);

    const handleCancel = useCallback((params) => {
        const rowId = params.data.clientId;

        const originalRow = originalClientList.find(r => r.clientId === rowId);

        if(!originalRow) return;

        params.node.setData({...originalRow});

        setEditingRowId(null);

        params.api.refreshCells({force: true});
    }, [originalClientList]);

    const handleSave = useCallback( async (params) => {
        try {
            setLoading(true);
            params.api.stopEditing(false);
            const updatedData = params.data;
            const response = await updateClientUseCase.execute(updatedData);
            getInfo();
            
            setEditingRowId(null);

            await AceptAlert({});
        } catch (error) {
            console.log("Error updating client data: ", error);
        } finally {
            setLoading(false);
        }
    }, [updateClientUseCase]);

    // AG Table columns config
    const columnDefinitions = useMemo(() => 
        getClientTableColumns({
            editingRowId,
            handleEdit,
            handleSave,
            handleCancel,
            isCellChanged,
            routeMap,
            routeOptions,
            showProblemAlert: async (title, text) => {
                await ProblemAlert({
                    title,
                    text
                });
            },
            loading,
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