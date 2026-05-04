import RoutesTablePage from "./routeTabla";
import Navbar from "../../../components/molecules/Navbar";
import '../../../css/routesInfo/routesInfo.css';

export default function RoutesInfo(){
    return(
        <div className="page">
            <Navbar />
            <RoutesTablePage />
        </div>
    )
}