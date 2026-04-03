import Login from "../../../components/organisms/Login";
import "../../../css/login/loginView.css"
import LogoComposPet from '../../../public/img/LogoComposPet.svg';
import Button from "../../../components/atoms/Button";
import Icon from "../../../components/atoms/Icon";

// SignInForm.jsx — agrega este import
import { useSignInViewModel } from "../../viewmodels/auth/loginViewModel";

function SignInForm(){

    const{
        email,
        password,
        errors,
        loading,
        setEmail,
        setPassword,
        onSubmit,
    } = useSignInViewModel();

    return(
        <main className="signIn-background">

            <div className="col d-flex flex-column align-items-center flex-wrap">

                <div className="logo-compospet">
                    <img src={LogoComposPet} alt="logo de ComposPet" />
                </div>

                <div className="forms-backgound">
                    <div className="title">
                        <h1>Inicio de Sesión</h1>
                        <p>Bienvenido, por favor inicia sesión con tus credenciales</p>
                    </div>

                    <form onSubmit={onSubmit}>

                        <Login
                            email={email}
                            password={password}
                            onEmailChange={(e) => setEmail(e.target.value)}
                            onPasswordChange={(e) => setPassword(e.target.value)}
                            emailError={errors.email}
                            passwordError={errors.password}
                        ></Login>

                        {/* Error general: cuenta bloqueada, error de red, etc. */}
                        {errors.general && (
                            <p className="error-message" role="alert">
                                {errors.general}
                            </p>
                        )}

                        {/* El botón refleja el estado de loading del ViewModel */}
                        <Button size="large" type="accept" className='button mt-4' disabled={loading}>
                            {loading ? "Ingresando..." : "Iniciar sesión"}
                        </Button>

                    </form>
                    

                    <a href="#" className="forgot-password">
                        ¿Olvidaste tu contraseña?
                    </a>
                    
                    <Button type='cancel' className='google-button'>
                        <Icon name="google" size="icon-medium"></Icon>
                        Continuar con Google
                    </Button>

                </div>

            </div>



        </main>
    );
}

export default SignInForm;