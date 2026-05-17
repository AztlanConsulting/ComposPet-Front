import useClientTableViewModel from "../viewmodels/clientTableViewModel";
import ClientTable from "../../components/organisms/clientTable";
import '../../css/atoms/clientTableColumnsDef.css';
import Navbar from "../../components/molecules/Navbar";
import ProblemAlert from "../../components/Template/ProblemAlert";
import DropdownInput from '../../components/molecules/DropdownInput';
import '../../css/clientView/client.css';
import SearchInput from "../../components/molecules/searchInput";

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
        routesDropdown,
        selectedRoute,
        setSelectedRoute,
        searchText,
        setSearchText,
        handleSearchText,
    } = useClientTableViewModel();

return (
    <main className="background">

        <Navbar />
    
        <section className="content-wrapper">

            <div className="table-container">
                <div className="filters-Row">
                    {/* Dropdown para filtro */}
                    <DropdownInput
                        id="routeFilter"
                        value={selectedRoute}
                        onChange={(e) => setSelectedRoute(e.target.value)}
                        options={routesDropdown}
                        className="dropdown"
                    />
                    <SearchInput
                        value={searchText}
                        onChange={(e) => handleSearchText(e.target.value)}
                    />
                </div>
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