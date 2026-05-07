import useClientTableViewModel from "../viewmodels/clientTableViewModel";
import ClientTable from "../../components/organisms/ClientTable";

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
    } = useClientTableViewModel();

return (
    <div>

    
        <div>
            Parte de arriba
        </div>

        <div>
            <ClientTable
                loading={loading}
                clientList={clientList}
                columnDefinitions={columnDefinitions}
                defaultColDef={defaultColDef}
            >
            </ClientTable>
        </div>

    </div>


    );
}