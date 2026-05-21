import RoutesTablePage from "./routeTabla";
import Navbar from "../../../components/molecules/Navbar";
import CopyLink from "../../../components/molecules/CopyLink";
import useRoutesViewModel from "../../viewmodels/routesInfo/routesTable";
import ColorsInfo from "./colorsInfo";
import BalanceCountersGroup from '../../../components/organisms/BalanceCountersGroup';
import CountersGroup from '../../../components/molecules/CountersGroup';
import '../../../css/routesInfo/routesInfo.css';

export default function RoutesInfo(){
    const routesViewModel = useRoutesViewModel();

    const { 
        copyLinkInfo,
        dayTotalAmount,
        routePayedAmount,
        routePendingAmount,
        weeklyPayedAmount,
        weeklyPendingAmount,
    } = routesViewModel;

    return(
        <div className="page">
            <Navbar />
            <div className="main">
                <div className="route-header-row">
                    <CountersGroup 
                        counters={[
                            { label: "Sumatoria total", value: dayTotalAmount },
                        ]}
                    />

                    <BalanceCountersGroup
                        counters={[
                            {
                                title: 'Ruta',
                                favorSubtitle: 'Pagado',
                                favorBalance: routePayedAmount,
                                pendingSubtitle: 'Pendiente',
                                pendingBalance: routePendingAmount,
                            },
                            {
                                title: 'Semana',
                                favorSubtitle: 'Pagado',
                                favorBalance: weeklyPayedAmount,
                                pendingSubtitle: 'Pendiente',
                                pendingBalance: weeklyPendingAmount,
                            },
                        ]}
                    />
                </div>
                    <CopyLink {...copyLinkInfo} />
            </div>

            <RoutesTablePage routesViewModel={routesViewModel} />

            <ColorsInfo />
        </div>
    );
}