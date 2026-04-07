import React, { useState } from 'react';
import "../../../css/login/loginView.css";

import LogoComposPet from '../../../public/img/LogoComposPet.svg';
import Button from "../../../components/atoms/Button";

import useFirstLoginViewModel from "../../viewmodels/auth/firstLoginViewModel";

import RequestOtpForm from "../../../components/organisms/RequestOtpForm";
import VerifyOtpForm from "../../../components/organisms/VerifyOtpForm";
import SetPasswordForm from "../../../components/organisms/SetPasswordForm";

function FirstLoginView() {
    const {
        step,
        loading,
        error,
        email,
        passwordErrors,
        setEmail,
        onRequestOTP,
        onVerifyOTP,
        onFinalize
    } = useFirstLoginViewModel();

    console.log("DEBUG - Estado del ViewModel:", { 
        step, 
        onRequestOTP, 
        onVerifyOTP, 
        onFinalize 
    });

    const [otp, setOtp] = useState("");
    const [p1, setP1] = useState("");
    const [p2, setP2] = useState("");

    const stepInfo = {
        1: { title: "Activa tu cuenta", sub: "Ingresa tu correo para recibir un código de acceso." },
        2: { title: "Verifica tu código", sub: `Enviamos un código de 6 dígitos a ${email}` },
        3: { title: "Crea tu contraseña", sub: "Establece una contraseña segura para tu cuenta." }
    };
    
    const handleAction = (e) => {
        if (e) e.preventDefault();
        if (step === 1) onRequestOTP();
        if (step === 2) onVerifyOTP(otp);
        if (step === 3) onFinalize(p1, p2);
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
                            />
                        )}

                        {/* Paso 2: OTP */}
                        {step === 2 && (
                            <VerifyOtpForm 
                                otp={otp}
                                onOtpChange={(e) => setOtp(e.target.value)}
                                otpError={error} // El error de 'código inválido'
                            />
                        )}

                        {/* Paso 3: Passwords */}
                        {step === 3 && (
                            <SetPasswordForm 
                                password={p1}
                                confirmPassword={p2}
                                onPasswordChange={(e) => setP1(e.target.value)}
                                onConfirmChange={(e) => setP2(e.target.value)}
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
                            className='button mt-4' 
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : 
                             step === 3 ? "Finalizar Activación" : "Continuar"}
                        </Button>

                    </form>

                    {step === 1 && (
                        <div className="mt-3 text-center">
                            <a href="/login" className="forgot-password">
                                Volver al inicio de sesión
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default FirstLoginView;