import { useCallback, useEffect, useState, useMemo } from "react";
import { GetClientTableUseCase } from "../../domain/useCases/getClientTableUseCase";
import { ClientTableRepository } from "../../data/repositories/clientTableRepository";
import { ClientApiClient } from "../../data/datasources/clientApiClient";

/**
 * ViewModel para la tabla de información de clientes de Compospet
 *
 * @returns {object} Estado de carga e información
 */
function useClientTableViewModel() {

    // AG Table config
    const columnDefinitions = useMemo(() => [
        {field: "name", headerName: "Nombre"},
        {field: "lastRequest", headerName: "Última recolección"},
        {field: "balance", headerName: "Saldo"},
        {field: "notes", headerName: "Notas"},
        {field: "cellphone", headerName: "Teléfono"},
        {field: "address", headerName: "Dirección"},
        {field: "route", headerName: "Ruta"},
        {field: "pets", headerName: "Mascotas"},
        {field: "family", headerName: "Familia"},
        {field: "status", headerName: "Estatus"},
    ])

    const defaultColDef = useMemo(() => ({
        filter: true,
        sortable: true,
        resizable: true,
        floatingFilter: true,
        tooltipValueGetter: (params) => params.value,
    }), []);

    const [clientList, setClientList] = useState([]);
    const [loading, setLoading] = useState(false);

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

        } catch (error) {
            console.log("Error loading client data: ", error);
        } finally {
            setLoading(false);
        }
    }, [getTableUseCase]);

    useEffect(() => {
        getInfo();
    }, []);

    return {
        clientList,
        loading,
        columnDefinitions,
        defaultColDef,
    };
}

export default useClientTableViewModel;