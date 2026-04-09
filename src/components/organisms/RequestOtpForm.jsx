import InputComponent from "../molecules/InputComponent";
import React from 'react';

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