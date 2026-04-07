export class FirstLogin {
    constructor({id, email, rol, firstLogin, token, codeVer, codeExp, password, step}) {
        this.id = id;
        this.email = email;
        this.rol = rol;
        this.firstLogin = firstLogin;
        this.token = token;
        this.codeVer = codeVer;
        this.codeExp = codeExp;
        this.password = password;
        this.step = step;

    }

    canAttemptVerification() {
        return this.step === 'CAN_VERIFY' && !!this.token;
    }

    isReadyToUpdatePassword() {
        return this.step === 'VERIFIED_STEP' && !!this.token;
    }

    /**
     * Indica si el usuario está realizando su primer inicio de sesión.
     * Se utiliza para redirigir al flujo de configuración inicial.
     *
     * @returns {boolean} `true` si es el primer inicio de sesión.
     */

    isFirstLogin(){
        return this.firstLogin === true;
    }

    /**
     * Indica si el usuario tiene rol de administrador.
     * Se utiliza para redirigir al dashboard administrativo tras el login.
     *
     * @returns {boolean} `true` si el rol del usuario es `"Administrador"`.
     */

    isAdmin(){
        return this.rol === "Administrador";
    }
}