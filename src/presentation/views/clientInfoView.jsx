import useClientTableViewModel from "../viewmodels/clientTableViewModel";
import ClientTableView from "./clientTableView";
import Navbar from "../../components/molecules/Navbar";
import CountersGroup from '../../components/molecules/CountersGroup';
import DropdownInput from '../../components/molecules/DropdownInput';
import '../../css/clientView/client.css';
import BalanceCountersGroup from "../../components/organisms/BalanceCountersGroup";

export default function ClientInfo(){

    const viewModel = useClientTableViewModel();

    return(
        <div className="page">
            <Navbar />
            <div className="main">
                 <div className="client-filter">
                    {/* Dropdown para filtro */}
                    <DropdownInput
                        id="routeFilter"
                        value={viewModel.selectedRoute}
                        onChange={(e) => viewModel.setSelectedRoute(e.target.value)}
                        options={viewModel.routesDropdown}
                        className="dropdown"
                    >
                        <span className="dropdown-label">Filtrar por ruta</span>
                    </DropdownInput>
                </div>
                <div className="counters-row">
                    {/* Contador Total de familias | Contador familias por ruta */}
                    <CountersGroup 
                        counters={[
                            { label: "Total de Familias", value: viewModel.totalActiveFamilies, icon:'family', color:'colorsIcon'},
                            { label: "Familias por ruta", value: viewModel.activeFamiliesByRoute, icon:'car', color:'colorsIcon' },
                        ]}
                    />
                    <BalanceCountersGroup
                        counters={[
                            {
                                title: 'Saldo favor',
                                favorSubtitle: 'Ruta',
                                favorBalance: viewModel.totalAmountPerRoute,
                                pendingSubtitle: 'Total',
                                pendingBalance:viewModel.totalAmount,
                                icon:'moneyBag',
                                color:'colorsIcon',
                            },
                            {
                                title: 'Pendiente',
                                favorSubtitle: 'Ruta',
                                favorBalance: viewModel.pendingAmountPerRoute,
                                pendingSubtitle: 'Total',
                                pendingBalance: viewModel.pendingAmount,
                                icon:'warning',
                                color:'colorsIcon',
                            },
                        ]}
                    />
                </div>
                <ClientTableView viewModel={viewModel}/>
            </div>
        </div>
    )
}