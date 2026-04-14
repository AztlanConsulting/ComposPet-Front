import "../../../css/login/loginView.css"

import Login from "../../../components/organisms/Login";
import LogoComposPet from '../../../public/img/LogoComposPet.svg';
import Button from "../../../components/atoms/Button";
import Icon from "../../../components/atoms/Icon";
import { Link } from 'react-router-dom';

import useLoginViewModel from "../../viewmodels/auth/loginViewModel";

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
        setEmail,
        setPassword,
        onGoogleLogin,
        onSubmit,
    } = useLoginViewModel();

    return(
        <main className="signIn-background">

            <div className="col d-flex flex-column align-items-center flex-wrap">

                <div className="logo-compospet">
                    <img src={LogoComposPet} alt="logo de ComposPet" />
                </div>

                <div className="forms-backgound">
                    <div className="title">
                        <h1>Inicio de Sesión de familias ComposPet</h1>
                        <p>¡Bienvenid@! Entra a tu sesión y sigue compostando con nosotros</p>
                    </div>

                    <form onSubmit={(e) => {console.log("form disparado"); onSubmit(e);}} className='col d-flex flex-column align-items-center flex-wrap'>

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
                            
                        <Button csstype='cancel' className='google-button' type="button" onClick={() => onGoogleLogin()} disabled={loading}>
                            <Icon name="google" size="icon-medium"></Icon>
                            {loading ? "Conectando..." : "Continuar con Google"}
                        </Button>

                        {/* El botón refleja el estado de loading del ViewModel */}
                        <Button size="large" type="submit" csstype="accept" className='button mt-4' disabled={loading}>
                            {loading ? "Ingresando..." : "Iniciar sesión"}
                        </Button>

                    </form>
                    

                    <a href="#" className="forgot-password">
                        ¿Olvidaste tu contraseña?
                    </a>

                    <Link to="/first-login" className="first-login">
                        Activa tu cuenta aquí
                    </Link>
                    
                    

                </div>

            </div>

        </main>
    );
}

export default SignInForm;