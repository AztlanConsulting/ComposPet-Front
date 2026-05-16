import RoutesTablePage from "./routeTabla";
import Navbar from "../../../components/molecules/Navbar";
import CopyLink from "../../../components/molecules/CopyLink";
import useRoutesViewModel from "../../viewmodels/routesInfo/routesTable";
import ColorsInfo from "./colorsInfo";

import '../../../css/routesInfo/routesInfo.css';

export default function RoutesInfo(){
    const { copyLinkInfo } = useRoutesViewModel();

    return(
        <div className="page">
            <Navbar />
            <div className="copy-link-container">
                <CopyLink {...copyLinkInfo} />
            </div>
            <RoutesTablePage />
            {/* Agrega información de colores */}
            <ColorsInfo />
        </div>
    )
}