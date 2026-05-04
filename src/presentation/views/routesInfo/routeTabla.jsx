import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientTable from "../../../components/organisms/clientTable";
import { RoutesViewModel } from "../../viewmodels/routesInfo/routesTable";
import Loading from '../../../components/Template/loading';
import Error from '../../../components/Template/error';
import TimerAlert from '../../../components/Template/timerAlert';
import '../../../css/routesInfo/routesInfo.css'

export default function RoutesTablePage() {
    const [routesList, setRoutesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const viewModel = useMemo(() => new RoutesViewModel(), []);

    const columnDefinitions = [
        { headerName: "Nombre", field: "name"},
        { headerName: "# Recolección", field: "collectedBuckets", editable: true },
        { headerName: "# Entrega", field: "deliveredBuckets", editable: true },
        { headerName: "Productos Extra", field: "extraProducts", editable: true },
        { headerName: "Ruta", field: "route"},
        { headerName: "Fecha", field: "date", editable: true },
        { headerName: "Horario", field: "schedule", editable: true },
        { headerName: "Forma de pago", field: "paymentMethod", editable: true },
        { headerName: "Total a pagar", field: "totalToPay", editable: true },
        { headerName: "Total pagado", field: "totalPaid", editable: true },
        { headerName: "Notas", field: "notes", editable: true },
    ];

    const defaultColDef = {
        flex: 1,
        sortable: true,
        filter: true,
        resizable: true,
        tooltipField: "notes",
    };

    useEffect(() => {
        console.log("Entro al use effect de route table")
        async function fetchRoutesInfo() {
            setLoading(true);
            setError(null);

            const result = await viewModel.loadRoutesInfo();

            if (result.error) {
                setError(error);
            }

            setRoutesList(result.data);
            setLoading(false);
        }

        fetchRoutesInfo();
    }, [viewModel]);

    if (loading){
        return <Loading />
    }

    if (error){
        return <Error message={"Error al obtener la información"}/>
    }

    return (
        <div className="table-container">
            <div className="table-scroll">
                <div className="ag-theme-alpine custom-green-theme">
                    <ClientTable
                        clientList={routesList}
                        columnDefinitions={columnDefinitions}
                        defaultColDef={defaultColDef}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
}