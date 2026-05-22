import useClientTableViewModel from "../viewmodels/clientTableViewModel";
import ClientTableView from "./clientTableView";
import Navbar from "../../components/molecules/Navbar";
import CountersGroup from '../../components/molecules/CountersGroup';
import '../../css/clientView/client.css';
import BalanceCountersGroup from "../../components/organisms/BalanceCountersGroup";

export default function ClientInfo(){

    const viewModel = useClientTableViewModel();

    return(
        <div className="page">
            <Navbar />
            <div className="main">
                <div className="counters-row">
                    {/* Contador Total de familias | Contador familias por ruta */}
                    <CountersGroup 
                        counters={[
                            { label: "Total de Familias", value: viewModel.totalActiveFamilies },
                            { label: "Familias por ruta", value: viewModel.activeFamiliesByRoute },
                        ]}
                    />

                    <BalanceCountersGroup
                        counters={[
                            {
                            title: 'Saldo total de ruta',
                            favorSubtitle: 'Saldo a favor',
                            favorBalance: viewModel.totalAmountPerRoute,
                            pendingSubtitle: 'Saldo pendiente',
                            pendingBalance: viewModel.pendingAmountPerRoute,
                            },
                            {
                            title: 'Saldo total',
                            favorSubtitle: 'Saldo a favor',
                            favorBalance: viewModel.totalAmount,
                            pendingSubtitle: 'Saldo pendiente',
                            pendingBalance: viewModel.pendingAmount,
                            },
                        ]}
                    />
                </div>
                <ClientTableView viewModel={viewModel}/>
            </div>
        </div>
    )
}