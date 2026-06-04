import '../../css/Template/temporaryView.css';
import Logo from '../../public/img/LogoComposPet.svg';
import Navbar from '../molecules/Navbar';
/**
 * Componente de error.
 * Muestra un mensaje de error junto con un ícono y el logo de la aplicación.
 */
export default function TemporaryView ({ navbarStatus, message, img=true, }) {
    return(
        <>
            {navbarStatus === true && <Navbar />}

            <div className="temporary-container">
                <div className="temporary-text">{message}</div>

                {img === true && (
                    <img
                        src={Logo}
                        alt="ComposPet"
                        className="temporary-logo"
                    />
                )}
            </div>
        </>
    );
}