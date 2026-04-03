import SignIn from "../../components/organisms/SignIn";
import "../../css/signIn/SignInView.css"
import Image from '../../components/atoms/Image';

import LogoComposPet from '../../public/img/LogoComposPet.svg';
import Button from "../../components/atoms/Button";
import Icon from "../../components/atoms/Icon";

function SignInForm(){

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

                    <form action="">

                        <SignIn></SignIn>

                    </form>
                    

                    <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                    
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