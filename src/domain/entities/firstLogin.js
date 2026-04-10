/**
 * @class FirstLogin
 * @description Entidad de dominio que representa el estado y las reglas de negocio 
 * durante el proceso de activación de cuenta y primer inicio de sesión.
 */
export class FirstLogin {
    /**
     * @param {Object} params - Atributos de la entidad.
     * @param {number} [params.id] - Identificador único del usuario.
     * @param {string} params.email - Correo electrónico institucional.
     * @param {string} [params.rol] - Rol asignado (ej. "Administrador", "Usuario").
     * @param {boolean} [params.firstLogin] - Bandera que indica si la cuenta está pendiente de activación.
     * @param {string} [params.token] - JWT temporal (seedToken o flowToken) para persistir la sesión del flujo.
     * @param {string} [params.codeVer] - Código OTP de verificación.
     * @param {Date} [params.codeExp] - Fecha de expiración del código OTP.
     * @param {string} [params.password] - Hash de la contraseña (usado solo en fase final).
     * @param {string} params.step - Estado actual del flujo ('CAN_VERIFY' | 'VERIFIED_STEP').
     */
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

    /**
     * Valida si la entidad tiene el estado y los requisitos necesarios para
     * proceder a la pantalla de ingreso de OTP.
     * @returns {boolean}
     */
    canAttemptVerification() {
        return this.step === 'CAN_VERIFY' && !!this.token;
    }

    /**
     * Valida si el usuario ya ha verificado su identidad y puede
     * proceder a establecer su nueva contraseña de 12 caracteres.
     * @returns {boolean}
     */
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