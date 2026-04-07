import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FirstLoginUseCase } from '../../../domain/useCases/firstLoginUseCase';
import { FirstLoginRepository } from '../../../data/repositories/firstLoginRepository';
import { FirstLoginApiClient } from '../../../data/datasources/FirstLoginApiClient';

/**
 * Valida los criterios de seguridad de la nueva contraseña en el Frontend.
 * @param {string} p1 - Nueva contraseña
 * @param {string} p2 - Confirmación de contraseña
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

    // 3. Validar complejidad: 8 caracteres, 1 mayúscula, 1 número o símbolo
    // Regex: (?=.*[A-Z]) (una mayúscula), (?=.*[0-9!@#$%^&*]) (número o símbolo), .{8,} (mínimo 8)
    const complexRegex = /^(?=.*[A-Z])(?=.*[0-9!@#$%^&*])(?=.{8,})/;
    
    if (!complexRegex.test(p1)) {
        errors.password = "La contraseña debe tener 8 caracteres, una mayúscula y un número o símbolo.";
        errors.hasErrors = true;
    }

    return errors;
}

export function useFirstLoginViewModel() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [email, setEmail] = useState("");
    const [entity, setEntity] = useState(null); 
    const [passwordErrors, setPasswordErrors] = useState({ password: "", confirmPassword: "" });

    const getUseCase = () => {
        const apiClient = new FirstLoginApiClient();
        const repository = new FirstLoginRepository(apiClient);
        return new FirstLoginUseCase(repository);
    };

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
            
            alert("Cuenta activada con éxito. Ahora puedes iniciar sesión.");
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