import { useEffect, useState, useMemo, useCallback } from 'react';
import { 
    GetAvailableWeeksUseCase, 
    GetDaysOfRoutesUseCase, 
    GetFilteredRoutesUseCase, 
    GetRoutesInfoUseCase,
    GetDataForEditingRequestUseCase,
    UpdateRequestUseCase, 
} from "../../../domain/useCases/routesInfo/routesTableUseCase";
import { GenerateRouteMessagesUseCase } from '../../../domain/useCases/routesInfo/generateRouteMessagesUseCase';
import { RoutesRepository } from "../../../data/repositories/routesInfo/routesRepository";
import '../../../css/tokens/colors.css';
import { isValidSearchText } from "../utils/searchValidation";

import { getRoutesTableColumns } from '../utils/routesTableColumnDefinitions';
import ProblemAlert from "../../../components/Template/ProblemAlert";
import AceptAlert from "../../../components/Template/AceptAlert";
import usePrompt from '../utils/usePrompt';
import ValidationObserver from '../utils/validationObserver';

/**
 * ViewModel para la gestión de información de rutas.
 * Actúa como intermediario entre la vista y la capa de dominio,
 * manejando la lógica de presentación y transformando los datos
 * para su consumo en la interfaz de usuario.
 * 
 * @function useRoutesViewModel
 */
function useRoutesViewModel(){
    const [weeks, setWeeks] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [daysOfRoutes, setDaysOfRoutes] = useState([]);
    const [selectedDay, setSelectedDay] = useState(undefined);
    const [routesList, setRoutesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [originalRoutesList, setOriginalRoutesList] = useState([]);
    const [editingRowId, setEditingRowId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchProduct, setSearchProduct] = useState('');
    const [weeklyRoutesList, setWeeklyRoutesList] = useState([]);

    const [payMethods, setPayMethods] = useState([]);
    const payOptions = payMethods.map(r => r.id_pago);
    const payMap = Object.fromEntries(
        payMethods.map(r => [r.id_pago, r.tipo])
    )
    const [extraProducts, setExtraProducts] = useState([]);

    const getRowClass = useCallback((params) => {
        const data = params.data;
        const classes = [];
        if (data?.name === editingRowId) {
            classes.push("row-editing");
        }
        
        if (
            data?.hasRequest === true &&
            data?.status === false
        ) {
            classes.push("row-inactive");
        }

        if (
            data?.hasRequest === true &&
            data?.wantsExtraProducts === false &&
            data?.wantsCollection === false
        ) {
            classes.push("row-neither");
        }

        return classes.join(" ");
    }, [editingRowId]);

    const isCellChanged = useCallback((params) => {
        const rowId = params.data.name;
        const field = params.colDef.field;

        const originalRow = originalRoutesList.find(c => c.name === rowId);

        if(!originalRow) return false;

        const originalValue = originalRow[field];
        const currentValue = params.value;

        if (typeof originalValue === 'object' || typeof currentValue === 'object') {
            return JSON.stringify(originalValue) !== JSON.stringify(currentValue);
        }

        return originalValue !== currentValue;
    }, [originalRoutesList]);

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
            text: "Guarda o descarta los cambios antes de cambiar de semana o día."
        });

        return false;
    }, [hasPendingChanges]);

    const handleWeekChange = useCallback(async (week) => {
        const canChange = await canChangeFilters();

        if (!canChange) return;

        setSelectedWeek(week);
    }, [canChangeFilters]);

    const handleDayChange = useCallback(async (day) => {
        const canChange = await canChangeFilters();

        if (!canChange) return;

        setSelectedDay(day);
    }, [canChangeFilters]);

    const handleEdit = useCallback((params) => {

        if (editingRowId !== null) return;

        setEditingRowId(params.data.name);

        setTimeout(() => {
            params.api.startEditingCell({
                rowIndex: params.node.rowIndex,
                colKey: 'collectedBuckets', 
            });
        });
    }, [editingRowId]);

    const handleCancel = useCallback((params) => {
        try{
            setLoading(true);

            params.api.stopEditing(false);
            const rowId = params.data.name;
            const originalRow = originalRoutesList.find(r => r.name === rowId);

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
            console.log("Error discarding changes in routes table: ", error);
        } finally {
            setLoading(false);
        }
    }, [originalRoutesList]);

    const getRoutesInfo = useMemo(
        () => new GetRoutesInfoUseCase(),
        []
    );

    const getAvailableWeeks = useMemo(
        () => new GetAvailableWeeksUseCase(),
        []
    );

    const getDaysOfRoutes = useMemo(
        () => new GetDaysOfRoutesUseCase(),
        []
    );

    const getFilteredRoutes = useMemo(
        () => new GetFilteredRoutesUseCase(),
        []
    );

    const getDropdownInfo = useMemo(
        () => new GetDataForEditingRequestUseCase(),
        []
    );

    const updateRequest = useMemo(
        () => new UpdateRequestUseCase(),
        []
    );

    const refreshRoutes = useCallback(async () => {
        const routes = await getFilteredRoutes.execute(
            selectedWeek,
            selectedDay || undefined
        );

        setRoutesList(routes);
        setOriginalRoutesList(
            JSON.parse(JSON.stringify(routes))
        );
    }, [
        selectedWeek,
        selectedDay,
        getFilteredRoutes,
    ]);

    const handleSave = useCallback(async (params) => {
        try {
            setLoading(true);
            params.api.stopEditing(false);

            if (ValidationObserver.hasErrors()) {
                await ProblemAlert({
                    title: "Error en los datos ingresados",
                    text: "Corrige los campos inválidos antes de guardar."
                });

                return;
            }

            const updatedData = params.data;
            await updateRequest.execute(updatedData);

            await refreshRoutes();

            setEditingRowId(null);
            await AceptAlert({});
        } catch (error) {
            await ProblemAlert({
                title: "Error al guardar",
                text: error.message || "Ocurrió un error al guardar los cambios"
            });
        } finally {
            ValidationObserver.clear();
            setLoading(false);
        }
    }, [updateRequest, refreshRoutes]);


    const generateRouteMessages = new GenerateRouteMessagesUseCase(
        new RoutesRepository()
    );
    
    const DAY_NAME_MAP = {
        0: "Domingo",
        1: "Lunes",
        2: "Martes",
        3: "Miércoles",
        4: "Jueves",
        5: "Viernes",
        6: "Sábado",
    };

    const formPath = "/inicio-sesion?redirect=/formulario-recoleccion";
    const formUrl = `https://compospetmx.org${formPath}`;
    const formLink = `¡Excelente día!

*¿Te anotamos para recolección mañana?* 🪣🚛
Apóyanos contestando el formulario de recolección de nuestra página ${formUrl} para registrar tu recolección 🫶🏼`;

    const copyLinkInfo = {
        text: "Formulario de recolección",
        link: formLink,
        bubbleMessage: "¡Copiado!",
    };

    /**
     * Genera mensajes de confirmación para la semana y día seleccionados.
     *
     * Valida que existan filtros seleccionados antes de ejecutar el caso de uso.
     * Si la operación es exitosa, abre automáticamente el archivo de Google Sheets
     * generado en una nueva pestaña del navegador.
     *
     * @async
     * @returns {Promise<void>}
     * @throws {Error} Lanza un error si faltan filtros o si falla la generación de mensajes.
     */
    const handleGenerateMessages = async () => {
        if (selectedWeek === null || !selectedDay) {
            throw new Error("Selecciona una semana y un día de ruta");
        }

        try {
            setLoading(true);
            setError(null);

            const result = await generateRouteMessages.execute(
                selectedWeek,
                selectedDay
            );

            if (result?.success === false) {
                throw new Error(result.message || "No hay mensajes para generar");
            }

            return result.data.sheetUrl;
            //window.open(result.data.sheetUrl, "_blank");
        } finally {
            setLoading(false);
        }
    }



    // Función para determinar si una fila debe tener fondo
    const hasRowBackground = useCallback((data) => {
        const rowClass = getRowClass({ data });

        return rowClass === "row-inactive" ||
            rowClass === "row-neither";
    }, [getRowClass]);

    // funcion que determina si el fondo es rojo
    const hasRedBackground = useCallback((data) => {
        return getRowClass({ data }) === "row-inactive";
    }, [getRowClass]);


    const handleSearchProduct = (value) => {
        if (!isValidSearchText(value)) return;
        setSearchProduct(value);
    };

    // ==================== CONFIGURACIÓN DE TABLA ====================
    const columnDefinitions = useMemo(() => 
        getRoutesTableColumns({
            editingRowId,
            isCellChanged,
            hasRowBackground,
            hasRedBackground,
            handleEdit,
            handleCancel,
            handleSave,
            loading,
            payMap,
            payOptions,
            extraProducts,
            getRowClass,
            handleSearchProduct,
            searchProduct,
            showProblemAlert: async (title, text) => {
                await ProblemAlert({
                    title,
                    text
                });
            },
        }),
    [editingRowId, 
        handleEdit, 
        handleCancel, 
        handleSave, 
        isCellChanged, 
        loading, 
        payMap, 
        payOptions, 
        extraProducts, 
        getRowClass,
        handleSearchProduct,
        searchProduct,
    ]);

    /**
     * Configuración por defecto para todas las columnas de la tabla.
     * Habilita ordenamiento, redimensionamiento y tooltips.
     */
    const defaultColDef = {
        sortable: true,
        resizable: true,
        // Aplica estilo de negrita a toda la fila si tiene fondo rojo
        cellStyle: (params) => {
            if (hasRedBackground(params.data)) {
                return {
                    fontWeight: "var(--font-weight-bold)",
                };
            }

            return null;
        },
    };

    const getDefaultDay = (days) => {
        const todayBase = DAY_NAME_MAP[new Date().getDay()];
        return (
            days.find(d => d.dia_ruta === `${todayBase} 1`)?.dia_ruta ||
            days.find(d => d.dia_ruta.startsWith(todayBase))?.dia_ruta ||
            null
        );
    };

    const formatWeeks = (weeks) => {
        const countByMonth = {};

        return weeks.map((week) => {
            const date = new Date(week.weekEnd);
            const month = date.toLocaleString("es-MX", { month: "long" });
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            countByMonth[monthKey] = (countByMonth[monthKey] || 0) + 1;

            const weekNumber = countByMonth[monthKey];
            const monthFormat = month.charAt(0).toUpperCase() + month.slice(1);

            return {
                ...week,
                label: `Semana ${weekNumber} - ${monthFormat}`,
            };
        });
    };

    const handleSearchText = (value) => {
        if (!isValidSearchText(value)) return;
        setSearchText(value);
    };

    const filteredRoutesList = useMemo(() => {
        return routesList.filter((route) => {
            const fullName = `${route.name || ''}`.toLowerCase();
            const matchesSearch = searchText.trim()
                ? fullName.includes(searchText.trim().toLowerCase())
                : true;
            return matchesSearch;
        });
    }, [routesList, searchText]);

    useEffect(() => {
        async function fetchDropdownInfo() {
            try {
                const data = await getDropdownInfo.execute();
                setPayMethods(data.payMethods);
                setExtraProducts(data.extraProducts);
            } catch (error) {
                setError(error.message || "Error al cargar información de dropdowns");
            }
        }
        fetchDropdownInfo();
    }, []);

    useEffect(() => {
        async function initialize() {
            setLoading(true);
            try {
                const [weeksData, daysData] = await Promise.all([
                    getAvailableWeeks.execute(),
                    getDaysOfRoutes.execute(),
                ]);

                const formattedWeeks = formatWeeks(weeksData);
                setWeeks(formattedWeeks);
                setDaysOfRoutes(daysData);

                const currentIndex = weeksData.findIndex(week => {
                    const now = new Date();
                    return now >= new Date(week.weekStart) && now < new Date(week.weekEnd);
                });
                const weekIdx = currentIndex >= 0 ? currentIndex : weeksData.length - 1;
                setSelectedWeek(weekIdx);
                const defaultDay = getDefaultDay(daysData);
                setSelectedDay(defaultDay)

                const routes = await getFilteredRoutes.execute(weekIdx, defaultDay);
                setRoutesList(routes);
                setWeeklyRoutesList(routes);

            } catch (err) {
                setError(err.message || "Error al inicializar");
            } finally {
                setLoading(false);
            }
        }
        initialize();
    }, []);

    useEffect(() => {

        if (selectedWeek === null || isNaN(selectedWeek) || selectedWeek < 0) return;

        async function fetchRoutes() {
            try {
                setLoading(true);
                setError(null);
                await refreshRoutes();
            } catch (error) {
                setError(
                    error.message ||
                    "Error al cargar la información"
                );

                setError(error.message || "Error al cargar la información");

            } finally {
                setLoading(false);
            }
        }

        fetchRoutes();
    }, [selectedWeek, selectedDay, refreshRoutes]);

    // carga todas las rutas de la semana seleccionada
    useEffect(() => {
        if (
            selectedWeek === null ||
            isNaN(selectedWeek) ||
            selectedWeek < 0 ||
            !daysOfRoutes.length
        ) {
            return;
        }

        async function fetchWeeklyRoutes() {
            try {
                const routes = (
                    await Promise.all(
                        daysOfRoutes.map(day =>
                            getFilteredRoutes.execute(
                                selectedWeek,
                                day.dia_ruta
                            )
                        )
                    )
                ).flat();

                setWeeklyRoutesList(routes);

            } catch {
                setWeeklyRoutesList([]);
            }
        }

        fetchWeeklyRoutes();

    }, [
        selectedWeek,
        daysOfRoutes,
        getFilteredRoutes
    ]);

    const resetFilters = () => {
        const currentIndex = weeks.findIndex(week => {
            const now = new Date();

            return (
                now >= new Date(week.weekStart) &&
                now < new Date(week.weekEnd)
            );
        });

        setSelectedWeek(
            currentIndex >= 0
                ? currentIndex
                : weeks.length - 1
        );

        setSelectedDay(null);
        setSelectedWeek(currentIndex >= 0 ? currentIndex : weeks.length - 1);
        setSelectedDay(getDefaultDay(daysOfRoutes));
    };

    const handleOpenRoutesSheet = () => {
        const url = process.env.REACT_APP_SHEETS_ROUTES_URL;
        if (!url) {
            console.error("URL de Google Sheets no configurada");
            return;
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };

    // formatea montos a moneda
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

    // convierte valores a número
    const getNumberValue = (value) => {
        if (!value) return 0;

        return Number(
            String(value)
                .replaceAll('$', '')
                .replaceAll(',', '')
                .trim()
        ) || 0;
    };

    // obtiene total a pagar
    const getTotalToPay = (route) => {
        return getNumberValue(route.totalToPay);
    };

    // obtiene total pagado
    const getTotalPaid = (route) => {
        return getNumberValue(route.totalPaid);
    };

    // calcula saldo pendiente
    const getPending = (route) => {
        return getTotalToPay(route) - getTotalPaid(route);
    };

    // contador de sumatoria total
    const dayTotalAmount = useMemo(() => {
        return filteredRoutesList.reduce(
            (total, route) => total + getTotalToPay(route),
            0
        );
    }, [filteredRoutesList]);

    // contador de ruta pagado
    const routePayedAmount = useMemo(() => {
        return filteredRoutesList.reduce(
            (total, route) => total + getTotalPaid(route),
            0
        );
    }, [filteredRoutesList]);

    // contador de ruta pendiente
    const routePendingAmount = useMemo(() => {
        return filteredRoutesList.reduce((total, route) => {
            const pending = getPending(route);

            return pending > 0
                ? total + pending
                : total;

        }, 0);

    }, [filteredRoutesList]);

    // aplica filtro de búsqueda para semana
    const filteredWeeklyRoutesList = useMemo(() => {
        const query = searchText.trim().toLowerCase();

        if (!query) {
            return weeklyRoutesList;
        }

        return weeklyRoutesList.filter(route =>
            `${route.name || ''}`
                .toLowerCase()
                .includes(query)
        );

    }, [
        weeklyRoutesList,
        searchText
    ]);

    // contador semanal pagado
    const weeklyPayedAmount = useMemo(() => {
        return filteredWeeklyRoutesList.reduce(
            (total, route) => total + getTotalPaid(route),
            0
        );

    }, [filteredWeeklyRoutesList]);

    // contador semanal pendiente
    const weeklyPendingAmount = useMemo(() => {
        return filteredWeeklyRoutesList.reduce((total, route) => {
            const pending = getPending(route);

            return pending > 0
                ? total + pending
                : total;

        }, 0);

    }, [filteredWeeklyRoutesList]);

    return {
        routesList: filteredRoutesList,
        weeks,
        selectedWeek,
        setSelectedWeek: handleWeekChange,
        daysOfRoutes,
        selectedDay,
        setSelectedDay: handleDayChange,
        loading,
        error,
        columnDefinitions,
        defaultColDef,
        resetFilters,
        copyLinkInfo,
        handleGenerateMessages,
        getRowClass,
        searchText,
        setSearchText,
        handleSearchText,
        dayTotalAmount: formatCurrency(dayTotalAmount),
        routePayedAmount: formatCurrency(routePayedAmount),
        routePendingAmount: formatCurrency(routePendingAmount),
        weeklyPayedAmount: formatCurrency(weeklyPayedAmount),
        weeklyPendingAmount: formatCurrency(weeklyPendingAmount),
        handleOpenRoutesSheet,
    }
}

export default useRoutesViewModel;