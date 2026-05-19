import useClientTableViewModel from "../viewmodels/clientTableViewModel";
import ClientTable from "../../components/organisms/clientTable";
import '../../css/atoms/clientTableColumnsDef.css';
import Navbar from "../../components/molecules/Navbar";
import ProblemAlert from "../../components/Template/ProblemAlert";
import DropdownInput from '../../components/molecules/DropdownInput';
import '../../css/clientView/client.css';
import CountersGroup from '../../components/molecules/CountersGroup';
import '../../css/molecules/countersGroup.css';

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
        routesDropdown,
        selectedRoute,
        setSelectedRoute,
        totalActiveFamilies,
        activeFamiliesByRoute,
    } = useClientTableViewModel();

return (
    <main className="background">

        <Navbar />
        <section className="content-wrapper">
            <div className="counters-row">
                {/* Contador Total de familias | Contador familias por ruta */}
                <CountersGroup 
                    counters={[
                        { label: "Total de Familias", value: totalActiveFamilies },
                        { label: "Familias por ruta", value: activeFamiliesByRoute },
                    ]}
                />
            </div>

            <div className='filters-Row'>
                {/* Dropdown para filtro */}
                <DropdownInput
                    id="routeFilter"
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    options={routesDropdown}
                    className="dropdown"
                />
            </div>

            <div className="table-container">
                <div className="table-scroll">
                    <ClientTable
                        loading={loading}
                        clientList={clientList}
                        columnDefinitions={columnDefinitions}
                        defaultColDef={defaultColDef}
                        editingRowId={editingRowId}
                    >
                    </ClientTable>
                </div>

            </div>            
        </section>

    </main>


    );
}