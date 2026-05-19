import useClientTableViewModel from "../viewmodels/clientTableViewModel";
import ClientTable from "../../components/organisms/ClientTable";
import '../../css/atoms/clientTableColumnsDef.css';
import Navbar from "../../components/molecules/Navbar";
import ProblemAlert from "../../components/Template/ProblemAlert";
import DropdownInput from '../../components/molecules/DropdownInput';
import '../../css/clientView/client.css';
import SearchInput from "../../components/molecules/searchInput";
import CountersGroup from '../../components/molecules/CountersGroup';
import '../../css/molecules/countersGroup.css';
import BalanceCountersGroup from '../../components/organisms/BalanceCountersGroup';

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

                <BalanceCountersGroup
                    routeCounter={{
                        title: 'Saldo total de ruta',
                        favorSubtitle: 'Saldo a favor',
                        favorBalance: '$361',

                        pendingSubtitle: 'Saldo pendiente',
                        pendingBalance: '- $147',
                    }}

                    totalCounter={{
                        title: 'Saldo total',
                        favorSubtitle: 'Saldo a favor',
                        favorBalance: '$361',

                        pendingSubtitle: 'Saldo pendiente',
                        pendingBalance: '- $147',
                    }}
                />
            </div>

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
                     <div className="client-search-wrapper">
                        <SearchInput
                            value={searchText}
                            onChange={(e) => handleSearchText(e.target.value)}
                            placeholder="Buscar a un cliente por nombre"
                        />
                     </div>
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