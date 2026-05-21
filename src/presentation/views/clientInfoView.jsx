import useClientTableViewModel from "../viewmodels/clientTableViewModel";
import ClientTableView from "./clientTableView";
import Navbar from "../../components/molecules/Navbar";
import CountersGroup from '../../components/molecules/CountersGroup';
import '../../css/clientView/client.css';
import BalanceCountersGroup from "../../components/organisms/BalanceCountersGroup";

export default function ClientInfo(){

    const { 
        totalActiveFamilies,
        activeFamiliesByRoute,
        totalAmount,
        pendingAmount,
        totalAmountPerRoute,
        pendingAmountPerRoute,
     } = useClientTableViewModel();

    return(
        <div className="page">
            <Navbar />
            <div className="counters-row">
                {/* Contador Total de familias | Contador familias por ruta */}
                <CountersGroup 
                    counters={[
                        { label: "Total de Familias", value: totalActiveFamilies },
                        { label: "Familias por ruta", value: activeFamiliesByRoute },
                    ]}
                />

                {/* <BalanceCountersGroup
                    counters={[
                        {
                        title: 'Saldo total de ruta',
                        favorSubtitle: 'Saldo a favor',
                        favorBalance: totalAmountPerRoute,
                        pendingSubtitle: 'Saldo pendiente',
                        pendingBalance: pendingAmountPerRoute,
                        },
                        {
                        title: 'Saldo total',
                        favorSubtitle: 'Saldo a favor',
                        favorBalance: totalAmount,
                        pendingSubtitle: 'Saldo pendiente',
                        pendingBalance: pendingAmount,
                        },
                    ]}
                /> */}
            </div>
            <ClientTableView />
        </div>
    )
}