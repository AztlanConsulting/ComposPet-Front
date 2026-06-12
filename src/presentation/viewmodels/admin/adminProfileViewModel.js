import { useState, useEffect } from 'react';
import { adminProfileUseCase } from '../../../di/admin/adminProfileDependencies';
import ProblemAlert from '../../../components/Template/ProblemAlert';

function useAdminProfileViewModel() {

    const [profile, setProfile] = useState({
        name: '',
        phone: '',
        email: '',
        accountHolder: '',
        accountNumber: '',
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await adminProfileUseCase.execute();
                setProfile(response.profile);
            } catch (error) {
                await ProblemAlert({
                    title: "Error al cargar el perfil",
                    text: "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
                    confirmText: "Entendido",
                });
                setError("No se pudo cargar la información del perfil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return {
        profile,
        loading,
        error,
    };
}

export default useAdminProfileViewModel;