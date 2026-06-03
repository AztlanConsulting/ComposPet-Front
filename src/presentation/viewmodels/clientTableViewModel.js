import { useCallback, useEffect, useState, useMemo, useRef } from "react";

import { 
    getTableUseCase, 
    getRoutesUseCase, 
    updateClientUseCase,
    getCompostStatusUseCase,
    updateCompostStatusUseCase,
} from '../../di/admin/clientTableDependencies';

import { getClientTableColumns } from "./utils/clientTableColumnDefinitions";
import ProblemAlert from "../../components/Template/ProblemAlert";
import AceptAlert from "../../components/Template/AceptAlert";
import { isValidSearchText } from "./utils/searchValidation";
import ConfirmAlert from "../../components/Template/confirmationAlert";
import usePrompt from "./utils/usePrompt";
import { validateField } from "./utils/clientFieldsValidations";
import ValidationObserver from "./utils/validationObserver";

/**
 * ViewModel para la tabla de información de clientes de Compospet
 *
 * @returns {object} Estado de carga e información
 */
function useClientTableViewModel() {

    // Estados para manejar la edición 
    const [editingRowId, setEditingRowId] = useState(null);
    const [originalClientList, setOriginalClientList] = useState([]);
    const [hasValidationErrors, setHasValidationErrors] = useState(false);
    
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

    // variable para el switcher de composta
    const [compostStatus, setCompostStatus] = useState(false);

    useEffect(() => {
        const unsubscribe = ValidationObserver.subscribe((errors) => {
            setHasValidationErrors(errors.size > 0);
        });

        return unsubscribe;
    }, []);

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

    const hasPendingChanges = useMemo(() => {
        return editingRowId !== null;
    }, [editingRowId]);

    usePrompt(hasPendingChanges);

    const canChangeFilters = useCallback(async () => {
        if(!hasPendingChanges){
            return true;
        }

        await ProblemAlert({
            title: "Tienes cambios pendientes",
            text: "Guarda o descarta los cambios antes de cambiar de ruta."
        });

        return false;
    }, [hasPendingChanges]);

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

    const getCompostStatus = useCallback( async () => {
        if (loading) return;
        try {
            setLoading(true);
            const response = await getCompostStatusUseCase.execute();
            setCompostStatus(response.status.data);
        } catch (error) {
            console.log("Error loading client data: ", error);
        } finally {
            setLoading(false);
        }
    }, [getCompostStatusUseCase]);

    const handleCompostStatusChange = useCallback(async () => {
        const result = await ConfirmAlert({
            title: "¿Deseas cambiar el estatus de la composta?",
            text: "La disponibilidad de entrega de composta será actualizada.",
            confirmText: "Sí, cambiar",
            cancelText: "Cancelar",
        });

        if (!result.isConfirmed) return;

        try {
            setLoading(true);

            const newStatus = !compostStatus;

            await updateCompostStatusUseCase.execute(newStatus);

            setCompostStatus(newStatus);

            await AceptAlert({});
        } catch (error) {
            await ProblemAlert({
                title: "Error",
                text: "No se pudo actualizar el estatus de la composta.",
            });
        } finally {
            setLoading(false);
        }
    }, [compostStatus]);

    useEffect(() => {
        getInfo();
        getRoutes();
        getCompostStatus();
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

    const getRowClass = useCallback((params) => {
        const data = params.data;
        const classes = [];

        if (data?.clientId === editingRowId) {
            classes.push("row-editing");
        }

        if (data?.status === false) {
            classes.push("client-inactive");
        }

        return classes.join(" ");
    }, [editingRowId])

    const handleCancel = useCallback((params) => {
        
        try {

            setLoading(true);

            params.api.stopEditing(false);

            const rowId = params.data.clientId;

            const originalRow = originalClientList.find(r => r.clientId === rowId);

            if(!originalRow) return;

            params.node.setData({...originalRow});

            ValidationObserver.clear();

            setEditingRowId(null);

            requestAnimationFrame(() => {
                params.api.redrawRows({
                    rowNodes: [params.node]
                });
            });

        } catch (error) {
            console.log("Error discarding changes in client data: ", error);
        } finally {
            setLoading(false);
        }
    }, [originalClientList]);

    const validateRow = (data) => {
        const fieldsToValidate = [
            "balance",
            "notes",
            "cellphone",
            "address",
            "order",
            "pets",
            "family",
            "email",
        ];
    
        for (const field of fieldsToValidate) {
            const result = validateField(field, data[field]);
    
            if (result !== true) {
                return {
                    valid: false,
                    field,
                    message: result,
                };
            }
        }
    
        return {
            valid: true,
            field: null,
            message: null,
        };
    };

    const handleSave = useCallback(async (params) => {

        try {
            setLoading(true);
    
            params.api.stopEditing(false);
    
            ValidationObserver.clear();
    
            const validation = validateRow(params.data);
    
            if (!validation.valid) {
                ValidationObserver.addError(validation.field);
    
                await ProblemAlert({
                    title: "Error en los datos ingresados",
                    text: validation.message
                });
    
                return;
            }
    
            await updateClientUseCase.execute(params.data);
    
            ValidationObserver.clear();
    
            await getInfo();
    
            setEditingRowId(null);
    
            await AceptAlert({});
    
        } catch (error) {
            await ProblemAlert({
                title: "Error al actualizar",
                text: error.message || "No se pudo actualizar la información del cliente."
            });
        } finally {
            ValidationObserver.clear();
            setLoading(false);
        }
    
    }, [updateClientUseCase, getInfo]);

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
    [
        editingRowId,
        handleEdit,
        handleSave,
        handleCancel,
        isCellChanged,
        routeMap,
        routeOptions,
        loading,
    ]);

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

            const fullName = `${client.name || ''}`.toLowerCase();

            const matechesSearch = searchText.trim()
                ? fullName.includes(searchText.trim().toLowerCase())
                : true;

            return matechesRoute && matechesSearch;
        })
    }, [clientList, selectedRoute, searchText]);

    const handleSearchText = (value) => {
        if (!isValidSearchText(value)) return;
        setSearchText(value);
    };

    const handleRouteChange = useCallback(async (route) => {
        const canChange = await canChangeFilters();

        if (!canChange) return;

        setSelectedRoute(route);
    }, [canChangeFilters]);

    const defaultColDef = useMemo(() => ({

        resizable: true,
        sortable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,

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

    // Funciones para los contadores de familias activas y familias por ruta
    const isActiveClient = (client) => client.status === true;

    const totalActiveFamilies = useMemo(() => {
        return clientList.filter(isActiveClient).length;
    }, [clientList]);

    const activeFamiliesByRoute = useMemo(() => {
        return clientList.filter(client => {
            const isActive = isActiveClient(client);
            const matchesRoute = selectedRoute
                ? client.routeId === Number(selectedRoute)
                : true;

            return isActive && matchesRoute;
        }).length;
    }, [clientList, selectedRoute]);

    // Función para formatear los montos en formato de moneda
    const formatCurrency = (amount) => {
        const numericAmount = Number(amount) || 0;

        const formattedAmount = Math.abs(numericAmount).toLocaleString(
            'es-MX',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        );


        if (numericAmount < 0) {
            return `-$${formattedAmount}`;
        }
    
        return `$${formattedAmount}`;
    };

    // Funciones para los contadores de saldo total y saldo pendiente
    const totalAmount = useMemo(() => {
        return clientList.reduce((total, client) => {
            const balance = Number(client.balance || 0);
    
            return balance > 0
                ? total + balance
                : total;
        }, 0);
    }, [clientList]);
    
    const pendingAmount = useMemo(() => {
        return clientList.reduce((total, client) => {
            const balance = Number(client.balance || 0);
    
            return balance < 0
                ? total + balance
                : total;
        }, 0);
    }, [clientList]);

    //Funciones para los contadores de saldo total y saldo pendiente por ruta
    const totalAmountPerRoute = useMemo(() => {
        return clientList.reduce((total, client) => {
            const balance = Number(client.balance || 0);
    
            if (Number(client.routeId) !== Number(selectedRoute)) {
                return total;
            }
    
            return balance > 0 ? total + balance : total;
        }, 0);
    }, [clientList, selectedRoute]);
    
    const pendingAmountPerRoute = useMemo(() => {
        return clientList.reduce((total, client) => {
            const balance = Number(client.balance || 0);
    
            if (Number(client.routeId) !== Number(selectedRoute)) {
                return total;
            }
    
            return balance < 0 ? total + balance : total;
        }, 0);
    }, [clientList, selectedRoute]);

    return {
        clientList: filteredClientList,
        loading,
        columnDefinitions,
        defaultColDef,
        editingRowId,
        routesDropdown,
        selectedRoute,
        setSelectedRoute: handleRouteChange,
        searchText,
        setSearchText,
        handleSearchText,
        totalActiveFamilies,
        activeFamiliesByRoute,
        compostStatus,
        getCompostStatus,
        handleCompostStatusChange,
        totalAmount: formatCurrency(totalAmount),
        pendingAmount: formatCurrency(pendingAmount),
        totalAmountPerRoute: formatCurrency(totalAmountPerRoute),
        pendingAmountPerRoute: formatCurrency(pendingAmountPerRoute),
        getRowClass,
    };
}

export default useClientTableViewModel;