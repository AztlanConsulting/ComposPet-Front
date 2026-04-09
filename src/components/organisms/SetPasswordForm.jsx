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
    const checks = [
        { label: "Mínimo 12 caracteres", met: password.length >= 12 },
        { label: "Al menos una mayúscula", met: /[A-Z]/.test(password) },
        { label: "Al menos una minúscula", met: /[a-z]/.test(password) },
        { label: "Al menos un número", met: /[0-9]/.test(password) },
        { label: "Al menos un símbolo (!@#$%^&*)", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
    ];

    return (
        <div className='col d-flex flex-column align-items-center flex-wrap'>
            <InputComponent
                id="new-password"
                type="password"
                size="lg"
                value={password}
                classNameLabel="label"
                onChange={onPasswordChange}
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
                onChange={onConfirmChange}
                required
            >
                Confirmar Contraseña
            </InputComponent>

            <div className="d-flex flex-column align-items-center px-4 mt-1 mb-3">
                {checks.map((check, index) => (
                    <span 
                        key={index}
                        className="forgot-password"
                        style={{ 
                            fontSize: 'var(--font-size-xs)',
                            marginBottom: '0px',
                            fontWeight: check.met 
                                ? 'var(--font-weight-semibold)' 
                                : 'var(--font-weight-regular)',
                            opacity: check.met ? 1 : 0.7,
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {check.met ? '✓ ' : '○ '} {check.label}
                    </span>
                ))}
            </div>

            {passwordError && <p className="error-message">{passwordError}</p>}
            {confirmError && <p className="error-message">{confirmError}</p>}
        </div>
    );
}