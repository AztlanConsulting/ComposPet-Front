/**
 * Entidad de dominio que representa a un usuario autenticado.
 * Encapsula los datos de sesión y expone métodos para consultar
 * el rol y el estado del usuario sin exponer la lógica de comparación al exterior.
 */

export class User{

    /**
     * @param {object} params - Datos del usuario provenientes del repositorio.
     * @param {number|string} params.id - Identificador único del usuario.
     * @param {string} params.email - Correo electrónico del usuario.
     * @param {string} params.rol - Rol asignado en el sistema (e.g. `"Administrador"`).
     * @param {boolean} params.firstLogin - Indica si es el primer inicio de sesión del usuario.
     * @param {string} params.token - Token JWT de sesión emitido por el servidor.
     */

    constructor({id, email, rol, firstLogin, token}){
        this.id = id;
        this.email = email;
        this.rol = rol;          
        this.firstLogin = firstLogin;
        this.token = token;
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

    /**
     * Indica si el usuario tiene rol de cliente.
     * Se utiliza para redirigir al formulario de recolección tras el login.
     *
     * @returns {boolean} `true` si el rol del usuario es `"Cliente"`.
     */

    isClient(){
        return this.rol === "Cliente";
    }
}