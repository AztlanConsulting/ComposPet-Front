import '../../css/Template/error.css';
import Logo from '../../public/img/LogoComposPet.svg';

/**
 * Componente de error.
 * Muestra un mensaje de error junto con un ícono y el logo de la aplicación.
 */
export default function Error ({ message}) {
    return(
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-text">{message}</p>
            <img src={Logo} alt="ComposPet" className="error-logo" />
        </div>
    );
}