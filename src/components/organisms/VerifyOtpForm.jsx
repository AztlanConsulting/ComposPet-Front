import InputComponent from "../molecules/InputComponent";
import React, { useEffect, useRef } from 'react';

/**
 * Formulario para la validación del código de un solo uso (OTP).
 * Segundo paso del flujo de "First Login".
 * * @param {Object} props
 * @param {string} props.otp - El valor del código de 6 dígitos ingresado.
 * @param {function} props.onOtpChange - Manejador para actualizar el estado del código.
 * @param {string} props.otpError - Mensaje de error (ej. "Código expirado" o "Código incorrecto").
 */
export default function VerifyOtpForm({
    otp = "",
    onOtpChange = () => {},
    otpError = "",
}) {
    return (
        <div className='col d-flex flex-column align-items-center flex-wrap'>
            <InputComponent
                id="otp-input"
                type="text"
                size="lg"
                value={otp}
                placeholder="000000"
                classNameLabel="label"
                onChange={onOtpChange}
                required
            > Codigo de verificación
            </InputComponent>
        </div>
    );
}