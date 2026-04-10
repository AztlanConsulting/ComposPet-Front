import InputComponent from "../molecules/InputComponent";
import React from 'react';

/**
 * Formulario para la solicitud del código de verificación (OTP).
 * Primer paso del flujo de "First Login".
 * * @param {Object} props
 * @param {string} props.email - Valor del campo de correo.
 * @param {function} props.onEmailChange - Handler para actualizar el estado del correo.
 * @param {string} props.emailError - Mensaje de error proveniente de la validación del backend o frontend.
 */
export default function RequestOtpForm({
    email = "",
    onEmailChange = () => {},
    emailError = ""
}) {
    return (
        <div className='col d-flex flex-column align-items-center flex-wrap'>
            <InputComponent
                id="activation-email"
                type="email"
                size="lg"
                value={email}
                classNameLabel="label"
                onChange={onEmailChange}
                required
            > Correo
            </InputComponent>
        </div>
    );
}