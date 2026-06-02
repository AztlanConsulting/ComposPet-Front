import "../../../css/login/loginView.css"

import Login from "../../../components/organisms/Login";
import LogoComposPet from '../../../public/img/LogoComposPet.svg';
import Button from "../../../components/atoms/Button";
import Icon from "../../../components/atoms/Icon";
import { Link } from 'react-router-dom';

import { loginUseCase } from "../../../di/auth/authProvider";
import useLoginViewModel from "../../viewmodels/auth/loginViewModel";
import { useNavigate } from "react-router-dom";

/**
 * Vista de la pantalla de inicio de sesión conectada al ViewModel.
 * Obtiene el estado y los manejadores desde `useLoginViewModel` y los
 * delega al organismo `Login` para su presentación.
 *
 * Gestiona tres tipos de error: de campo (correo, contraseña) y general
 * (red, cuenta bloqueada, etc.), mostrando cada uno en su contexto visual.
 * El botón de envío se deshabilita durante la petición para evitar envíos duplicados.
 *
 * @returns {JSX.Element} Pantalla completa de inicio de sesión.
 * @see useLoginViewModel
 * @see Login
 */

function SignInForm(){

    const{
        email,
        password,
        errors,
        loading,
        loadingAction,
        setEmail,
        setPassword,
        onGoogleLogin,
        onSubmit,
    } = useLoginViewModel(loginUseCase);

    const navigate = useNavigate();

    return(
        <main className="signIn-background">

            <div className="col d-flex flex-column align-items-center flex-wrap">

                <div className="logo-compospet">
                    <img src={LogoComposPet} alt="logo de ComposPet" fetchPriority="high" />
                </div>

                <div className="forms-backgound">
                    <div className="title">
                        <h1>Inicio de Sesión de familias ComposPet</h1>
                        <p>¡Bienvenid@! Entra a tu sesión y sigue compostando con nosotros</p>
                    </div>

                    <form onSubmit={onSubmit} className='col d-flex flex-column align-items-center flex-wrap form-content'>

                        <Login
                            email={email}
                            password={password}
                            onEmailChange={(e) => setEmail(e.target.value)}
                            onPasswordChange={(e) => setPassword(e.target.value)}
                            emailError={errors.email}
                            passwordError={errors.password}
                        ></Login>

                        {/* Error general: cuenta bloqueada, error de red, etc. */}
                        {errors.general && 
                            <p className="error-message">
                                {errors.general}
                            </p>}

                        <Button 
                            size="large" 
                            type="submit" 
                            csstype="accept" 
                            className='auxiliar-button signin mb-02' 
                            disabled={loading}
                        >
                            {loading ? "Ingresando..." : "Iniciar sesión"}
                        </Button>

                        <div className="separator">
                            <span>O</span>
                        </div>


                        <Button 
                            size="large" 
                            type="button" 
                            csstype="cancel" 
                            className='auxiliar-button' 
                            onClick={() => navigate("/activar-cuenta")}
                            disabled={loading}
                        >
                            {loading ? "Ingresando..." : "Activar cuenta"}
                        </Button>
                        
                        <Button 
                            csstype='cancel' 
                            className='auxiliar-button' 
                            type="button" 
                            onClick={() => onGoogleLogin()} 
                            disabled={loadingAction === 'google'}
                        >
                            <Icon name="google" size="medium"></Icon>
                            {loadingAction ? "Conectando..." : "Continuar con Google"}
                        </Button>

                    </form>
                    
                    <Link to="/recuperar-contraseña" className="forgot-password">
                        ¿Olvidaste tu contraseña? <b>Recuperar contraseña</b> 
                    </Link>

                </div>

            </div>

        </main>
    );
}

export default SignInForm;