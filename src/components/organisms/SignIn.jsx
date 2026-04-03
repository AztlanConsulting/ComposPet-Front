import InputComponent from "../molecules/InputComponent";
import Button from "../atoms/Button";
import React from 'react'

/**
 * Formulario de inicio de sesión con campos de correo y contraseña.
 * Delega el manejo del estado y las validaciones al componente padre;
 * este componente es exclusivamente de presentación.
 * Los errores de validación se reflejan visualmente aplicando la clase
 * `input-error` al campo correspondiente.
 *
 * @param {Function} [onEmailChange=()=>{}] - Manejador del evento de cambio en el campo de correo.
 * @param {Function} [onPasswordChange=()=>{}] - Manejador del evento de cambio en el campo de contraseña.
 * @param {string} [emailError=""] - Mensaje de error del correo. Si no está vacío, aplica estilo de error al input.
 * @param {string} [passwordError=""] - Mensaje de error de la contraseña. Si no está vacío, aplica estilo de error al input.
 * @returns {JSX.Element} Formulario con inputs de correo, contraseña y botón de inicio de sesión.
 * @see InputComponent
 * @see Button
 */

export default function SignIn({
    onEmailChange = () => {},
    onPasswordChange = () => {},
    emailError = "",
    passwordError = "",
}) {
    return (

        <div className='col d-flex flex-column align-items-center flex-wrap'>
            <InputComponent
                id="email-input"
                type="email"
                size="lg"
                classNameLabel="label"
                classNameInput={`input ${emailError ? "input-error" : ""}`}
                onChange={onEmailChange}
            >
                Correo
            </InputComponent>

            <InputComponent
                id="password-input"
                type="password"
                size="lg"
                classNameLabel="label"
                classNameInput={`input ${passwordError ? "input-error" : ""}`}
                onChange={onPasswordChange}
                required
            >
                Contraseña
            </InputComponent>

            <Button size="large" type="accept" className='button mt-4'>
                Iniciar Sesión
            </Button>

        </div>

    )
}
