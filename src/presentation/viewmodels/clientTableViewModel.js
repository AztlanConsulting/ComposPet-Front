import { useCallback, useEffect, useState, useMemo } from "react";

import { 
    getTableUseCase, 
    getRoutesUseCase, 
    updateClientUseCase 
} from '../../di/admin/clientTableDependencies';

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
    // establece que ruta se selecciona
    const [selectedRoute, setSelectedRoute] = useState('');
    // Lista de las opciones para el dropdown
    const [routesDropdown, setRoutesDropdown] = useState([]);

    // variable para el buscador
    const [searchText, setSearchText] = useState('');

    const getRoutes = useCallback( async () => {
        if (loading) return;

        try{
            setLoading(true);

            const response = await getRoutesUseCase.execute();
            setRouteList(response);

            // Para las rutas del dropdown
            const mappedRoutes = response
                .sort((a, b) => a.id_ruta - b.id_ruta)
                .map(route => ({
                    value: route.id_ruta,
                    label: route.dia_ruta
             }));

            setRoutesDropdown([
                { value: '', label: 'Sin filtro' },
                ...mappedRoutes
            ]);

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
        
        try {

            setLoading(true);

            params.api.stopEditing(false);

            const rowId = params.data.clientId;

            const originalRow = originalClientList.find(r => r.clientId === rowId);

            if(!originalRow) return;

            params.node.setData({...originalRow});

            setEditingRowId(null);

            params.api.refreshCells({force: true});

        } catch (error) {
            console.log("Error discarding changes in client data: ", error);
        } finally {
            setLoading(false);
        }
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

    // *********************************************************************
    // Variable que obtiene la lista de clientes filtrada de acuerdo a:
    // 1. La ruta seleccionada en el dropdown.
    // 2. El texto ingresado en el buscador.
    //
    // useMemo memoriza el resultado del filtrado y solo vuelve a calcularlo
    // cuando cambia:
    // - la lista de clientes,
    // - la ruta seleccionada,
    // - o el texto de búsqueda.
    // **********************************************************************
    const filteredClientList = useMemo(() => {
        return clientList.filter((client) => {
            const matechesRoute = selectedRoute
                ? client.routeId === Number(selectedRoute)
                : true;

            const fullName = `${client.name} || ''}`.toLowerCase();

            const matechesSearch = searchText.trim()
                ? fullName.includes(searchText.trim().toLowerCase())
                : true;

            return matechesRoute && matechesSearch;
        })
    }, [clientList, selectedRoute, searchText]);

    const defaultColDef = useMemo(() => ({

        sortable: true,
        resizable: true,

        tooltipValueGetter: (params) => params.value,
    }), []);

    useEffect(() => {

        const handleBeforeUnload = (event) => {

            if (editingRowId !== null) {

                event.preventDefault();

                event.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };

    }, [editingRowId]);

    return {
        clientList: filteredClientList,
        loading,
        columnDefinitions,
        defaultColDef,
        editingRowId,
        routesDropdown,
        selectedRoute,
        setSelectedRoute,
        searchText,
        setSearchText,
    };
}

export default useClientTableViewModel;