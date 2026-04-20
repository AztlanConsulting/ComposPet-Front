import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirstLoginUseCase } from '../../../domain/useCases/firstLoginUseCase';
import { FirstLoginRepository } from '../../../data/repositories/firstLoginRepository';
import { FirstLoginApiClient } from '../../../data/datasources/FirstLoginApiClient';

/**
 * Valida los criterios de seguridad de la nueva contraseña en el Frontend.
 * Sincronizado con la política de seguridad de 12 caracteres y complejidad.
 * * @param {string} p1 - Nueva contraseña.
 * @param {string} p2 - Confirmación de contraseña.
 * @returns {Object} Objeto con mensajes de error y bandera de estado.
 */
function validatePasswordForm(p1, p2) {
    const errors = { password: "", confirmPassword: "", hasErrors: false };

    // 1. Verificar que no estén vacíos
    if (!p1 || !p2) {
        errors.password = "Ambos campos son obligatorios.";
        errors.hasErrors = true;
        return errors;
    }

    // 2. Verificar que coincidan
    if (p1 !== p2) {
        errors.confirmPassword = "Las contraseñas no coinciden.";
        errors.hasErrors = true;
    }

    // 3. Validar complejidad: 12 caracteres, 1 mayúscula, 1 número y 1 símbolo
    const complexRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{12,}$/;
    
    if (!complexRegex.test(p1)) {
        errors.password = "La contraseña debe tener 12 caracteres, una mayúscula y un número o símbolo.";
        errors.hasErrors = true;
    }

    return errors;
}

/**
 * ViewModel para el flujo de Primer Inicio de Sesión.
 * Gestiona el estado de la UI y coordina las llamadas a los Casos de Uso.
 * * @returns {Object} Estados y manejadores de eventos para la Vista.
 */
export function useFirstLoginViewModel() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [entity, setEntity] = useState(null);

    const [p1, setP1] = useState("");
    const [p2, setP2] = useState("");
    const [passwordErrors, setPasswordErrors] = useState({ password: "", confirmPassword: "" });

    /**
     * Factory local para instanciar el caso de uso con sus dependencias.
     * @private
     */
    const getUseCase = () => {
        const apiClient = new FirstLoginApiClient();
        const repository = new FirstLoginRepository(apiClient);
        return new FirstLoginUseCase(repository);
    };

    /**
     * Maneja el cambio del código OTP limitándolo a 6 caracteres.
     * @param {string} value - El valor del input.
     */
    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); 
        if (value.length <= 6) setOtpCode(value);
    };

    /**
     * Actualiza la contraseña y limpia errores previos para restaurar la visualización de los checks.
     * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
     */
    const handlePasswordChange = (e) => {
        const val = e.target.value;
        setP1(val);
        // Clean Code: Si ya existe un error, lo removemos para mostrar los checks de nuevo
        if (passwordErrors.password) {
            setPasswordErrors(prev => ({ ...prev, password: "" }));
        }
    };

    /**
     * Actualiza la confirmación de contraseña y limpia el error de coincidencia.
     * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
     */
    const handleConfirmChange = (e) => {
        const val = e.target.value;
        setP2(val);
        if (passwordErrors.confirmPassword) {
            setPasswordErrors(prev => ({ ...prev, confirmPassword: "" }));
        }
    };

    /**
     * Fase 1: Solicitar código de activación.
     */
    const onRequestOTP = async (e) => {
        if(e) e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const useCase = getUseCase();
            const resultEntity = await useCase.executeRequest(email);
            
            setEntity(resultEntity);
            setStep(2); 
        } catch (err) {
            if (err.message === "Failed to fetch" || !navigator.onLine) {
                setError("No se pudo establecer conexión con el servidor. Intenta más tarde.");
            } else {
                setError(err.message || "Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fase 2: Verificar el código recibido por correo.
     */
    const onVerifyOTP = async () => {
        if (otpCode.length !== 6) {
            setError("El código debe ser de 6 dígitos.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const useCase = getUseCase();
            const token = entity?.token || "";
            const updatedEntity = await useCase.executeVerify(email, otpCode, token);
            
            setEntity(updatedEntity);
            setStep(3); 
        } catch (err) {
            if (err.message === "Failed to fetch" || !navigator.onLine) {
                setError("No se pudo establecer conexión con el servidor. Intenta más tarde.");
            } else {
                setError(err.message || "Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fase 3: Establecer la contraseña final y activar cuenta.
     */
    const onFinalize = async () => {
        const validation = validatePasswordForm(p1, p2);
        
        if (validation.hasErrors) {
            setPasswordErrors(validation);
            return; 
        }

        setLoading(true);
        setError(null);

        try {
            const useCase = getUseCase();

            await useCase.executeFinalize(
                entity?.email || email, 
                p1, 
                p2, 
                entity?.token 
            );
            
            navigate("/inicio-sesion"); 
        } catch (err) {
            if (err.message === "Failed to fetch" || !navigator.onLine) {
                setError("No se pudo establecer conexión con el servidor. Intenta más tarde.");
            } else {
                setError(err.message || "Ocurrió un error inesperado.");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        loading,
        error,
        email,
        otpCode, 
        entity,
        p1,
        p2, 
        passwordErrors,
        handlePasswordChange,
        handleConfirmChange,  
        handleOtpChange, 
        setEmail,
        setP1, 
        setP2,
        onRequestOTP,
        onVerifyOTP,
        onFinalize
    };
}

export default useFirstLoginViewModel;