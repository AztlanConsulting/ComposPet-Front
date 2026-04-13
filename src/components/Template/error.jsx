import '../../css/Template/error.css';
import Logo from '../../public/img/LogoComposPet.svg';

export default function Error ({ message}) {
    return(
        <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p className="error-message">{message}</p>
            <img src={Logo} alt="ComposPet" className="error-logo" />
        </div>
    )
}