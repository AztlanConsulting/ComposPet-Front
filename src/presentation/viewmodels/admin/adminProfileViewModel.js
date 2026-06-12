import { useState, useEffect } from 'react';
import { adminProfileUseCase, updateAdminProfileUseCase } from '../../../di/admin/adminProfileDependencies';

import ConfirmAlert from '../../../components/Template/confirmationAlert';
import AceptAlert from '../../../components/Template/AceptAlert';
import ProblemAlert from '../../../components/Template/ProblemAlert';

function useAdminProfileViewModel() {

    const [profile, setProfile] = useState({
        name: '', phone: '', email: '', accountHolder: '', accountNumber: '',
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saveError, setSaveError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await adminProfileUseCase.execute();
                setProfile(response);
                setName(response.name ?? '');
                setPhone(response.phone ?? '');
                setEmail(response.email ?? '');
                setAccountHolder(response.accountHolder ?? '');
                setAccountNumber(response.accountNumber ?? '');
            } catch (error) {
                setError("No se pudo cargar la información del perfil.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEdit = () => {
        setSaveError(null);
        setFieldErrors({});
        setIsEditing(true);
    };

    const handleCancel = async () => {
        const result = await ConfirmAlert({
            title: "¿Estás seguro que deseas cancelar?",
            text: "Se perderán los cambios no guardados.",
            confirmText: "Sí, cancelar",
            cancelText: "Seguir editando",
        });

        if (result.isConfirmed) {
            setName(profile.name ?? '');
            setPhone(profile.phone ?? '');
            setEmail(profile.email ?? '');
            setAccountHolder(profile.accountHolder ?? '');
            setAccountNumber(profile.accountNumber ?? '');
            setSaveError(null);
            setFieldErrors({});
            setIsEditing(false);
        }
    };

    const handleSave = async () => {
        setSaveError(null);
        setFieldErrors({});

        try {
            const updated = await updateAdminProfileUseCase.execute({
                name, phone, email, accountHolder, accountNumber,
            });

            setProfile(updated);
            setName(updated.name ?? '');
            setPhone(updated.phone ?? '');
            setEmail(updated.email ?? '');
            setAccountHolder(updated.accountHolder ?? '');
            setAccountNumber(updated.accountNumber ?? '');
            setIsEditing(false);

            await AceptAlert({
                title: "¡Perfil actualizado con éxito!",
                confirmText: "De acuerdo",
            });

        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.errors) {
                setFieldErrors(error.response.data.errors);
            } else {
                await ProblemAlert({
                    title: "Error al guardar",
                    text: "No se pudo guardar el perfil. Inténtalo de nuevo.",
                    confirmText: "Entendido",
                });
            }
        }
    };

    return {
        profile,
        loading,
        error,
        saveError,
        fieldErrors,
        isEditing,
        name, setName,
        phone, setPhone,
        email, setEmail,
        accountHolder, setAccountHolder,
        accountNumber, setAccountNumber,
        handleEdit,
        handleCancel,
        handleSave,
    };
}

export default useAdminProfileViewModel;