import { useState, useEffect, useRef } from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';

import ConfirmAlert from '../../../components/Template/confirmationAlert';
import AceptAlert from '../../../components/Template/AceptAlert';
import ProblemAlert from '../../../components/Template/ProblemAlert';

import { registerClientUseCase } from '../../../di/admin/registerClientDependencies';

function validateForm(name, lastname1, email, phone, address){
    const errors = { name: "", lastname1: "", email: "", phone: "", address: "" };
    let hasErrors = false;

    if(!name){
        errors.name = "El nombre del cliente es requerido.";
        hasErrors = true;
    } else if (!/^[a-zA-ZÀ-ÿ\s]{1,80}$/.test(name)){
        errors.name = "Solo puedes ingresar letras mayúsculas y minúsculas.";
        hasErrors = true;
    }
        
    if(!lastname1){
        errors.lastname1 = "El primer apellido es requerido.";
        hasErrors = true;
    } else if(!/^[a-zA-ZÀ-ÿ\s]{1,80}$/.test(lastname1)){
        errors.lastname1 = "Solo puedes ingresar letras mayúsculas y minúsculas.";
        hasErrors = true;
    }

    if(!email){
        errors.email = "El correo es requerido.";
        hasErrors = true;
    } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
        errors.email = "Ingresa un correo válido.";
        hasErrors = true;
    }

    if(!phone){
        errors.phone = "El teléfono es requerido.";
        hasErrors = true;
    } else if (!/^(\+52[\s-]?)?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/.test(phone)) {
        errors.phone = "Ingresa un teléfono válido.";
        hasErrors = true;
    }

    if (!address) {
        errors.address = "La dirección es requerida.";
        hasErrors = true;
    }

    return { errors, hasErrors };
}

function useRegisterClientViewModel(){

    const[errors, setErrors] = useState({ name: "", lastname1: "", email: "", phone: "", address: "" });

    const [name, setName] = useState('');
    const [lastname1, setLastName1] = useState('');
    const [lastname2, setLastName2] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pets, setPets] = useState('');
    const [family, setFamily] = useState('');
    const [notes, setNotes] = useState('');
    const [address, setAddress] = useState('');

    const nameRef = useRef(null);
    const lastname1Ref = useRef(null);
    const emailRef = useRef(null);
    const phoneRef = useRef(null);
    const addressRef = useRef(null);

    const navigate = useNavigate();

    const hasUnsavedChanges = name || lastname1 || lastname2 || 
                        email || phone || address || 
                        pets || family || notes;

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const handleSubmit = async (e, { selectedDay, selectedZone, validateDropdowns, setDropdownErrors }) => {
        
        e.preventDefault();

        const validation = validateForm(name, lastname1, email, phone, address);
        const dropdownValidation = validateDropdowns();

        if (validation.hasErrors || dropdownValidation.hasErrors) {
            if (validation.hasErrors) 
                setErrors(validation.errors);
            if (dropdownValidation.hasErrors) 
                setDropdownErrors(dropdownValidation.errors);

            if (validation.errors.name && nameRef.current) {
                nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                nameRef.current.focus();
            } else if (validation.errors.lastname1 && lastname1Ref.current) {
                lastname1Ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                lastname1Ref.current.focus();
            } else if (validation.errors.email && emailRef.current) {
                emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                emailRef.current.focus();
            } else if (validation.errors.phone && phoneRef.current) {
                phoneRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                phoneRef.current.focus();
            } else if (validation.errors.address && addressRef.current) {
                addressRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                addressRef.current.focus();
            }
            return;
        }

        const data = {
            name, lastname1, lastname2, email, phone,
            pets, family, notes,
            address, selectedDay, selectedZone,
        };

        try {
            const response = await registerClientUseCase.execute(data);
            await confirmForm();
        } catch (error) {
            const status = error?.response?.status;
            const message = error?.response?.data?.message

            if (status === 409) {
                await ProblemAlert({
                    title: "Correo ya registrado",
                    text: "Ya existe un cliente registrado con este correo electrónico.",
                    confirmText: "Entendido",
                });
            } else {
                await ProblemAlert({
                    title: "Error del servidor",
                    text: "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
                    confirmText: "Entendido",
                });
            }
        }
        
    };

    const cancelForm = async () => {
        const result = await ConfirmAlert({
            title: "¿Estas seguro que deseas salir del formulario?",
            text: "Se perderán los cambios no guardados.",
            confirmText: "Sí, cancelar",
            cancelText: "Seguir editando",
        });

        if (result.isConfirmed) {
            navigate("/admin/info-cliente");
        }
    };

    const confirmForm = async () => {
        const result = await AceptAlert({
            title: "¡Cliente registrado con éxito!",
            confirmText: "De acuerdo",
        });

        if (result.isConfirmed) {
            navigate("/admin/info-cliente");
        }
    }

    return {
        errors,
        name, setName,
        lastname1, setLastName1,
        lastname2, setLastName2,
        email, setEmail,
        phone, setPhone,
        pets, setPets,
        family, setFamily,
        notes, setNotes,
        address, setAddress,
        cancelForm, confirmForm,
        handleSubmit,
        nameRef, lastname1Ref, 
        emailRef, phoneRef, addressRef,
    };
}

export default useRegisterClientViewModel;