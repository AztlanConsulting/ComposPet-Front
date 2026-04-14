import InputComponent from "../molecules/InputComponent";
import React from 'react';

/**
 * Organismo para el establecimiento de una nueva contraseña.
 * Muestra dinámicamente o los requisitos de seguridad (checks) o los errores de validación.
 * * @component
 * @param {Object} props
 * @param {string} props.password - Valor de la nueva contraseña.
 * @param {string} props.confirmPassword - Valor de la confirmación.
 * @param {function} props.onPasswordChange - Handler para cambios en la contraseña.
 * @param {function} props.onConfirmChange - Handler para cambios en la confirmación.
 * @param {string} props.passwordError - Mensaje de error de formato de contraseña.
 * @param {string} props.confirmError - Mensaje de error de coincidencia.
 */
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

            {!passwordError ? (
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
            ) : (
                <div className="mt-1 mb-3 px-4 text-center">
                    <p className="error-message" style={{ fontSize: 'var(--font-size-xs)' }}>
                        {passwordError}
                    </p>
                </div>
            )}

            {/* Error de confirmación: Siempre visible si existe */}
            {confirmError && (
                <p className="error-message text-center">{confirmError}</p>
            )}
        </div>
    );
}