import InputComponent from "../molecules/InputComponent";
import React from 'react';

export default function VerifyOtpForm({
    otp = "",
    onOtpChange = () => {},
    otpError = ""
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
                classNameInput={`input text-center ${otpError ? "input-error" : ""}`}
                onChange={onOtpChange}
                error={otpError}
                required
            >
                Código de Verificación
            </InputComponent>
            <p className="info-text mt-2">Revisa tu bandeja de entrada o spam.</p>
        </div>
    );
}