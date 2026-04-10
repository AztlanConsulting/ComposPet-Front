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
        errors.password = "La contraseña debe tener 8 caracteres, una mayúscula y un número o símbolo.";
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
    const [entity, setEntity] = useState(null); 
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
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fase 2: Verificar el código recibido por correo.
     */
    const onVerifyOTP = async (code) => {
        setLoading(true);
        setError(null);

        try {
            const useCase = getUseCase();
            const updatedEntity = await useCase.executeVerify(email, code, entity.token);
            
            setEntity(updatedEntity);
            setStep(3); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fase 3: Establecer la contraseña final y activar cuenta.
     */
    const onFinalize = async (pass1, pass2) => {
        const validation = validatePasswordForm(pass1, pass2);
        
        if (validation.hasErrors) {
            setPasswordErrors({
                password: validation.password,
                confirmPassword: validation.confirmPassword
            });
            return; 
        }

        setPasswordErrors({ password: "", confirmPassword: "" });
        setLoading(true);
        setError(null);

        try {
            const apiClient = new FirstLoginApiClient();
            const repository = new FirstLoginRepository(apiClient);
            const useCase = new FirstLoginUseCase(repository);

            await useCase.executeFinalize(
                entity.email, 
                pass1, 
                pass2, 
                entity.token 
            );
            
            navigate("/login"); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        loading,
        error,
        email,
        entity,
        passwordErrors, 
        setEmail,
        onRequestOTP,
        onVerifyOTP,
        onFinalize
    };
}

export default useFirstLoginViewModel;