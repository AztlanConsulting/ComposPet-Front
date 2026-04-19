import React, { useState, useEffect } from 'react';
import "../../../css/login/loginView.css";

import LogoComposPet from '../../../public/img/LogoComposPet.svg';
import Button from "../../../components/atoms/Button";

import useFirstLoginViewModel from "../../viewmodels/auth/firstLoginViewModel";

import RequestOtpForm from "../../../components/organisms/RequestOtpForm";
import VerifyOtpForm from "../../../components/organisms/VerifyOtpForm";
import SetPasswordForm from "../../../components/organisms/SetPasswordForm";

/**
 * Vista de activación de cuenta vinculada a `useFirstLoginViewModel`.
 * * Orquestra el flujo de tres pasos (Email, OTP y Contraseña) delegando la 
 * presentación a organismos especializados. Gestiona estados de carga, 
 * errores de validación y el temporizador de reenvío de código.
 * * @returns {JSX.Element} Flujo secuencial de primer inicio de sesión.
 * @see useFirstLoginViewModel
 */
function FirstLoginView() {
    const {
        step,
        loading,
        error,
        email,
        otpCode,
        p1,
        p2, 
        passwordErrors,  
        handleOtpChange, 
        setEmail,
        handlePasswordChange, 
        handleConfirmChange,
        onRequestOTP,
        onVerifyOTP,
        onFinalize
    } = useFirstLoginViewModel();

    const stepInfo = {
        1: { title: "Activa tu cuenta", sub: "Para asegurar tu cuenta, necesitamos confirmar que tu correo es correcto" },
        2: { title: "Verifica tu código", sub: `Hemos enviado un código a ${email}. Por favor, ingrésalo abajo` },
        3: { title: "Crea tu nueva contraseña", sub: "Para proteger tu información en ComposPet, elige una contraseña fuerte" }
    };
    const [seconds, setSeconds] = useState(30);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let timer;
        if (step === 2 && seconds > 0) {
            timer = setTimeout(() => setSeconds(seconds - 1), 1000);
        } else if (seconds === 0) {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [step, seconds]);

    const handleResendOTP = (e) => {
        e.preventDefault();
        if (canResend) {
            onRequestOTP(); 
            setSeconds(30);
            setCanResend(false);
        }
    };

    const handleAction = (e) => {
        if (e) e.preventDefault();
        if (step === 1) onRequestOTP();
        if (step === 2) onVerifyOTP();
        if (step === 3) onFinalize();
    };

    return (
        <main className="signIn-background">
            <div className="col d-flex flex-column align-items-center flex-wrap">
                
                <div className="logo-compospet">
                    <img src={LogoComposPet} alt="logo de ComposPet" />
                </div>

                <div className="forms-backgound">
                    <div className="title text-center">
                        <h1>{stepInfo[step].title}</h1>
                        <p>{stepInfo[step].sub}</p>
                    </div>

                    <form onSubmit={handleAction} className='col d-flex flex-column align-items-center flex-wrap'>
                        
                        {/* Paso 1: Email */}
                        {step === 1 && (
                            <RequestOtpForm 
                                email={email} 
                                onEmailChange={(e) => setEmail(e.target.value)}
                                emailError={error} // El error de 'correo no encontrado'
                                autoFocus={true}
                            />
                        )}

                        {/* Paso 2: OTP */}
                        {step === 2 && (
                            <>
                                <VerifyOtpForm 
                                    otp={otpCode}
                                    onOtpChange={handleOtpChange}
                                    otpError={error}
                                />
                                {/* Enlace de reenvío debajo del organismo */}
                                <div className="mt-2 text-center">
                                    {canResend ? (
                                        <a href="#!" className="forgot-password" onClick={handleResendOTP}>
                                            Reenviar código
                                        </a>
                                    ) : (
                                        <span className="forgot-password" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                                            Reenviar código en {seconds}s
                                        </span>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Paso 3: Passwords */}
                        {step === 3 && (
                            <SetPasswordForm 
                                password={p1}
                                confirmPassword={p2}
                                onPasswordChange={handlePasswordChange}
                                onConfirmChange={handleConfirmChange}
                                passwordError={passwordErrors.password}
                                confirmError={passwordErrors.confirmPassword}
                            />
                        )}

                        {/* Error General (Red, Servidor, etc) */}
                        {error && !passwordErrors.hasErrors && (
                            <p className="error-message mt-2">{error}</p>
                        )}

                        <Button 
                            size="large" 
                            type="submit" 
                            csstype="accept" 
                            className='button' 
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : 
                             step === 3 ? "Actualizar" : "Continuar"}
                        </Button>

                    </form>

                
                    <div className="mt-3 text-center">
                        <a href="/login" className="return">
                            Volver al inicio de sesión
                        </a>
                    </div>
                    
                </div>
            </div>
        </main>
    );
}

export default FirstLoginView;