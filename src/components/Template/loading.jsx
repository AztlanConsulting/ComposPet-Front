import '../../css/Template/loading.css';
import Logo from '../../public/img/LogoComposPet.svg';

/**
 * Componente de carga.
 * Muestra un spinner, un mensaje y el logo de la aplicación
 * mientras se procesan datos o se realizan peticiones.
 */
function Loading() {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando...</p>
            <img src={Logo} alt="ComposPet Logo" className="loading-logo" />
        </div>
    );
}

export default Loading;