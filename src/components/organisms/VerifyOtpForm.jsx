import InputComponent from "../molecules/InputComponent";
import React, { useEffect, useRef } from 'react';

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