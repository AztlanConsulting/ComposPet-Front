import InputComponent from "../molecules/InputComponent";
import Button from "../atoms/Button";

import React from 'react'

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
