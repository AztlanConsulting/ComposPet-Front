import '../../css/Template/temporaryView.css';
import Logo from '../../public/img/LogoComposPet.svg';
import Navbar from '../molecules/Navbar';
/**
 * Componente de error.
 * Muestra un mensaje de error junto con un ícono y el logo de la aplicación.
 */
export default function TemporaryView ({ navbarStatus, message }) {
    return(
        <>
            {navbarStatus === true && <Navbar />}

            <div className="temporary-container">
                <p className="temporary-text">{message}</p>

                <img 
                    src={Logo} 
                    alt="ComposPet" 
                    className="temporary-logo" 
                />
            </div>
        </>
    );
}