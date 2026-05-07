import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientTable from "../../../components/organisms/ClientTable";
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
        { headerName: "Nombre", field: "name", width: 150},
        { headerName: "# Recolección", field: "collectedBuckets", width: 150},
        { headerName: "# Entrega", field: "deliveredBuckets", width: 150},
        { headerName: "Productos Extra", field: "extraProducts", width: 150},
        //{ headerName: "Ruta", field: "route", width: 150},
        { headerName: "Horario", field: "schedule", width: 150},
        { headerName: "Forma de pago", field: "paymentMethod", width: 150},
        { headerName: "Total a pagar", field: "totalToPay", width: 150},
        { headerName: "Total pagado", field: "totalPaid", width: 150},
        { headerName: "Notas", field: "notes", width: 150},
    ];

    const defaultColDef = {
        sortable: true,
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

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error message={"Error al obtener la información"} />
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