import InputComponent from "../molecules/InputComponent";
import React from 'react';

export default function SetPasswordForm({
    password = "",
    confirmPassword = "",
    onPasswordChange = () => {},
    onConfirmChange = () => {},
    passwordError = "",
    confirmError = ""
}) {
    return (
        <div className='col d-flex flex-column align-items-center flex-wrap'>
            <InputComponent
                id="new-password"
                type="password"
                size="lg"
                value={password}
                classNameLabel="label"
                classNameInput={`input ${passwordError ? "input-error" : ""}`}
                onChange={onPasswordChange}
                error={passwordError}
                required
            >
                Nueva Contraseña
            </InputComponent>

            <InputComponent
                id="confirm-password"
                type="password"
                size="lg"
                value={confirmPassword}
                classNameLabel="label"
                classNameInput={`input ${confirmError ? "input-error" : ""}`}
                onChange={onConfirmChange}
                error={confirmError}
                required
            >
                Confirmar Contraseña
            </InputComponent>
        </div>
    );
}