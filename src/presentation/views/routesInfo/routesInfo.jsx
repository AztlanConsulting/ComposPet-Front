import RoutesTablePage from "./routeTabla";
import Navbar from "../../../components/molecules/Navbar";
import CopyLink from "../../../components/molecules/CopyLink";
import useRoutesViewModel from "../../viewmodels/routesInfo/routesTable";
import ColorsInfo from "./colorsInfo";
import BalanceCountersGroup from '../../../components/organisms/BalanceCountersGroup';

export default function RoutesInfo(){
    const { copyLinkInfo } = useRoutesViewModel();

    return(
        <div className="page">
            <Navbar />
            <div className="route-header-row">
                <BalanceCountersGroup
                    routeCounter={{
                        title: 'Saldo total de ruta',
                        favorSubtitle: 'Saldo a favor',
                        favorBalance: '$361',

                        pendingSubtitle: 'Saldo pendiente',
                        pendingBalance: '- $147',
                    }}

                    totalCounter={{
                        title: 'Saldo total semanal',
                        favorSubtitle: 'Saldo a favor',
                        favorBalance: '$361',

                        pendingSubtitle: 'Saldo pendiente',
                        pendingBalance: '- $147',
                    }}
                />
                <div className="copy-link-container">
                    <CopyLink {...copyLinkInfo} />
                </div>
            </div>
            <RoutesTablePage />
            {/* Agrega información de colores */}
            <ColorsInfo />
        </div>
    )
}