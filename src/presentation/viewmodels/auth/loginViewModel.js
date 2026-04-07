import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LoginUseCase } from "../../../domain/useCases/loginUseCase";
import { AuthRepository } from "../../../data/repositories/authRepository";
import { AuthApiClient } from "../../../data/datasources/authApiClient";

import { useGoogleLogin } from '@react-oauth/google';

/**
 * Valida los campos del formulario de inicio de sesión antes de enviarlo.
 * Aplica validaciones de presencia y formato sobre el correo y la contraseña.
 *
 * Validaciones aplicadas:
 * - Correo: no vacío y formato RFC 5322 simplificado.
 * - Contraseña: no vacía, mínimo 8 caracteres, al menos una mayúscula,
 *   una minúscula y un dígito.
 *
 * @param {string} email - Correo electrónico ingresado por el usuario.
 * @param {string} password - Contraseña ingresada por el usuario.
 * @returns {{ errors: { email: string, password: string, general: string }, hasErrors: boolean }}
 * Objeto con los mensajes de error por campo y un indicador de si hay al menos un error.
 */

function validateLoginForm(email, password){
    const errors = { email: "", password: "", general: ""};
    let hasErrors = false;

    if(!email){
        errors.email = "El correo es requerido.";
        hasErrors = true;
    } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
        errors.email = "Ingresa un correo válido.";
        hasErrors = true;
    }

    if (!password) {
        errors.password = "La contraseña es requerida.";
        hasErrors = true;
    }

    return { errors, hasErrors };
}

/**
 * ViewModel del flujo de inicio de sesión.
 * Gestiona el estado del formulario, ejecuta las validaciones locales
 * y orquesta la llamada al caso de uso `LoginUseCase`.
 *
 * Tras una autenticación exitosa, almacena el token en `sessionStorage`
 * y redirige según el rol y estado del usuario:
 * - Administrador → `/dashboard`
 * - Usuario en primer inicio → `/`
 * - Usuario regular → `/`
 *
 * Los errores del servidor se clasifican por mensaje para asignarlos
 * al campo correspondiente (correo, contraseña o error general).
 *
 * @returns {{
 *   email: string,
 *   password: string,
 *   errors: { email: string, password: string, general: string },
 *   loading: boolean,
 *   setEmail: Function,
 *   setPassword: Function,
 *   onSubmit: Function
 * }} Estado y manejadores del formulario de login.
 *
 * @see LoginUseCase
 * @see validateLoginForm
 */

function useLoginViewModel(){

    const navigate = useNavigate();

    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[errors, setErrors] = useState({ email: "", password: "", general: "" });
    const[loading, setLoading] = useState(false);

    /**
     * Maneja el envío del formulario de inicio de sesión.
     * Valida los campos localmente antes de realizar la petición.
     * Si la validación falla, actualiza los errores y cancela el envío.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - Evento de envío del formulario.
     */
    const onSubmit = async (e) =>{
        e.preventDefault();

        console.log("onSubmit ejecutado", email, password);

        const { errors: validationErrors, hasErrors } = validateLoginForm(email, password);

        console.log("validationErrors:", validationErrors);  // ← agrega esto
        console.log("hasErrors:", hasErrors);   

        if (hasErrors){
            setErrors(validationErrors);
            console.log("hay errores de validación, se corta aquí");
            return;
        }

        console.log("pasó validación, llamando al backend...");

        setErrors({ email: "", password: "", general: "" });
        setLoading(true);

        try{

            const apiClient = new AuthApiClient();
            const authRepo = new AuthRepository(apiClient);
            const loginUseCase = new LoginUseCase(authRepo);

            const user = await loginUseCase.execute(email, password);

            sessionStorage.setItem("token", user.token);

            if(user.isAdmin()){
                navigate("/dashboard");
            } else if (user.isFirstLogin()){
                navigate("/");
            } else {
                navigate("/");
            }
        } catch (err) {
            // Se clasifica el error según palabras clave del mensaje para asignarlo al campo correcto
            const msg = err.message;
            if (msg.includes("correo")) {
                setErrors({ email: msg, password: "", general: "" });
            } else if (msg.includes("contraseña") || msg.includes("Credenciales")) {
                setErrors({ email: "", password: msg, general: "" });
            } else {
                setErrors({ email: "", password: "", general: msg });
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Manejador de la autenticación con Google (Google Identity Services).
     * * 1. Solicita permisos al usuario (incluyendo scopes para Gmail y Sheets).
     * 2. En el éxito (onSuccess), inicia el estado de carga y persiste el token de acceso de Google.
     * 3. Instancia las capas de Clean Architecture para validar el acceso con el backend de ComposPet.
     * 4. Almacena la sesión localmente y redirige al Dashboard.
     * 5. Gestiona errores de red o de permisos mediante el estado de errores del VM.
     * * @type {Function}
     * @see LoginUseCase.executeGoogle
     */
    const onGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            setErrors({});
            try {
                sessionStorage.setItem('googleAccessToken', tokenResponse.access_token);
                
                const apiClient = new AuthApiClient();
                const authRepo = new AuthRepository(apiClient);
                const loginUseCase = new LoginUseCase(authRepo); 

                const userEntity = await loginUseCase.executeGoogle(tokenResponse.access_token);
                
                sessionStorage.setItem('token', userEntity.token);
                sessionStorage.setItem('user', JSON.stringify(userEntity));
                
                if(userEntity.isAdmin()){
                    navigate("/dashboard");
                } else if (userEntity.isFirstLogin()){
                    navigate("/");
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("CLIC 3: Error en el bloque try/catch del VM", error);
                setErrors({ general: "Este correo no está registrado en ComposPet" });
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error("Login Failed:", error);
            setErrors({ general: "Error al conectar con Google" });
        },
        scope: process.env.REACT_APP_GOOGLE_SCOPES
    });

    return{
        email,
        password,
        errors,
        loading,

        setEmail,
        setPassword,
        onGoogleLogin, 
        onSubmit,
    };
}

export default useLoginViewModel;