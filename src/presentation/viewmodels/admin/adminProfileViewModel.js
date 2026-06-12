import { useState, useEffect } from 'react';
import { adminProfileUseCase } from '../../../di/admin/adminProfileDependencies';

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

    const [isEditing, setIsEditing] = useState(false);

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await adminProfileUseCase.execute();
                setProfile(response);

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

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        setPhone(profile.phone ?? '');
        setEmail(profile.email ?? '');
        setAccountHolder(profile.accountHolder ?? '');
        setAccountNumber(profile.accountNumber ?? '');
        setIsEditing(false);
    };

    const handleSave = async () => {
        // aquí irá la llamada al use case de update cuando se implemente
        setIsEditing(false);
    };

    return {
        profile,
        loading,
        error,
        isEditing,
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