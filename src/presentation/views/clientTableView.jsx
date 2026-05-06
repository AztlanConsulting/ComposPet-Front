import useClientTableViewModel from "../viewmodels/clientTableViewModel";
import ClientTable from "../../components/organisms/ClientTable";
import '../../css/atoms/clientTableColumnsDef.css';
import Navbar from "../../components/molecules/Navbar";
import ProblemAlert from "../../components/Template/ProblemAlert";

/**
 * Vista de la información de los clientes de Compospet
 *
 * @returns {JSX.Element} Vista icon la tabla de usuarios de Compospet.
 */
export default function ClientTableView() {

    const {
        loading,
        clientList,
        columnDefinitions,
        defaultColDef,
        editingRowId,
        routeList,
    } = useClientTableViewModel();

return (
    <main className="background">

        <Navbar />
    
        <div>
            Parte de arriba
        </div>

        <div>
            <ClientTable
                loading={loading}
                clientList={clientList}
                columnDefinitions={columnDefinitions}
                defaultColDef={defaultColDef}
                editingRowId={editingRowId}
            >
            </ClientTable>
        </div>

    </main>


    );
}