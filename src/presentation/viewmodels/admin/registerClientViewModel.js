import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import ConfirmAlert from '../../../components/Template/confirmationAlert';
import AceptAlert from '../../../components/Template/AceptAlert';
import ProblemAlert from '../../../components/Template/ProblemAlert';

import { registerClientUseCase } from '../../../di/admin/registerClientDependencies';

const ONLY_LETTERS_REGEX = /^[a-zA-ZÀ-ÿ\s]{1,100}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?\d{10,15}$/;
const ADDRESS_REGEX =  /^(?=.*[A-Za-zÀ-ÿ])[A-Za-zÀ-ÿ0-9.,#\-\s]{5,255}$/;
const HAS_LETTERS = /[A-Za-zÀ-ÿ]/;
const HAS_NUMBERS = /\d/;

/**
 * Valida los campos de texto obligatorios del formulario de registro de clientes.
 * No valida los campos de tipo dropdown; éstos son validados por `validateDropdowns`
 * en el ViewModel del catálogo.
 * Los campos opcionales (mascotas, familia, notas)
 * quedan excluidos de esta validación.
 *
 * @param {string} name - Nombre del cliente.
 * @param {string} lastname1 - Primer apellido del cliente.
 * @param {string} lastname2 - Segundo apellido del cliente.
 * @param {string} email - Correo electrónico del cliente.
 * @param {string} phone - Teléfono de contacto. Acepta formato mexicano con o sin prefijo +52.
 * @param {string} address - Dirección de entrega del cliente.
 * @returns {{ errors: Object, hasErrors: boolean }} Objeto con los mensajes de error por campo
 * y una bandera que indica si existe al menos un error.
 */

function validateForm(name, lastname1, lastname2, email, phone, address) {
    const errors = {
        name: "",
        lastname1: "",
        lastname2: "",
        email: "",
        phone: "",
        address: "",
    };

    let hasErrors = false;

    if (!name) {
        errors.name = "El nombre del cliente es requerido.";
        hasErrors = true;
    } else if (!ONLY_LETTERS_REGEX.test(name)) {
        errors.name = "Solo puedes ingresar letras mayúsculas y minúsculas.";
        hasErrors = true;
    }

    if (!lastname1) {
        errors.lastname1 = "El primer apellido es requerido.";
        hasErrors = true;
    } else if (!ONLY_LETTERS_REGEX.test(lastname1)) {
        errors.lastname1 = "Solo puedes ingresar letras mayúsculas y minúsculas.";
        hasErrors = true;
    }

    if (lastname2 && !ONLY_LETTERS_REGEX.test(lastname2)) {
        errors.lastname2 = "Solo puedes ingresar letras mayúsculas y minúsculas.";
        hasErrors = true;
    }

    if (!email) {
        errors.email = "El correo es requerido.";
        hasErrors = true;
    } else if (!EMAIL_REGEX.test(email)) {
        errors.email = "Ingresa un correo válido.";
        hasErrors = true;
    }

    if (!phone) {
        errors.phone = "El teléfono es requerido.";
        hasErrors = true;
    } else if (!PHONE_REGEX.test(phone)) {
        errors.phone = "Ingresa un teléfono válido.";
        hasErrors = true;
    }

    // Validación de dirección: se requiere al menos una letra, puede contener números, letras, espacios y algunos caracteres especiales comunes en direcciones.
    const trimmedAddress = String(address || '').trim();
    // Reemplaza múltiples espacios por uno solo para evitar que direcciones con espacios excesivos sean consideradas válidas.
    const cleanedAddress = trimmedAddress.replace(/\s+/g, ' '); // Reemplaza múltiples espacios por uno solo

    // Validación de dirección
    if (!trimmedAddress) {
        errors.address = "La dirección es requerida.";
        hasErrors = true;

    } else if (cleanedAddress.length < 5) {
        errors.address = "La dirección es muy corta.";
        hasErrors = true;

    } else if (!HAS_LETTERS.test(cleanedAddress) || !HAS_NUMBERS.test(cleanedAddress)) {
        errors.address = "Incluye al menos la calle y el número.";
        hasErrors = true;

    } else if (!ADDRESS_REGEX.test(cleanedAddress)) {
        errors.address = "Ingresa una dirección válida.";
        hasErrors = true;
    }

    return { errors, hasErrors };
}

/**
 * ViewModel para el formulario de registro de un nuevo cliente.
 * Gestiona el estado de todos los campos del formulario, la validación,
 * el envío de datos y la navegación al cancelar o confirmar el registro.
 * Incluye protección contra pérdida de datos no guardados al cerrar o recargar la página,
 * disparada cuando cualquier campo del formulario contiene información.
 *
 */

function useRegisterClientViewModel(){

    const [errors, setErrors] = useState({
        name: "",
        lastname1: "",
        lastname2: "",
        email: "",
        phone: "",
        address: "",
        pets: "",
        family: "",
        notes: "",
    });

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

    const validateField = (field, value) => {
        const updatedValues = {
            name,
            lastname1,
            lastname2,
            email,
            phone,
            address,
            [field]: value
        };

        const { errors: newErrors } = validateForm(
            updatedValues.name,
            updatedValues.lastname1,
            updatedValues.lastname2,
            updatedValues.email,
            updatedValues.phone,
            updatedValues.address,
        );

        setErrors(prev => ({
            ...prev,
            [field]: newErrors[field]
        }));
    };

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

    /**
     * Maneja el envío del formulario de registro.
     * Ejecuta la validación de campos de texto y de dropdowns en paralelo.
     * Si existen errores, aplica scroll y foco automático al primer campo inválido.
     * Si la validación es exitosa, ejecuta el caso de uso de registro.
     * Maneja de forma diferenciada el error 409 (correo duplicado)
     * del resto de errores de servidor.
     *
     * @param {React.FormEvent} e - Evento de envío del formulario.
     * @param {Object} dropdownContext - Contexto de validación de los dropdowns del catálogo.
     * @param {string} dropdownContext.selectedDay - Día de ruta seleccionado en el formulario.
     * @param {Function} dropdownContext.validateDropdowns - Función que valida los campos dropdown.
     * @param {Function} dropdownContext.setDropdownErrors - Setter de errores de los dropdowns.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (e, { selectedDay, priceType, validateDropdowns, setDropdownErrors }) => {
        
        e.preventDefault();

        const validation = validateForm(
            name,
            lastname1,
            lastname2,
            email,
            phone,
            address,
        );
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
            name: name.trim(),
            lastname1: lastname1.trim(),
            lastname2: lastname2.trim(),
            email: email.trim(),
            phone: phone.trim(),
            pets,
            family,
            notes,
            address: address.trim(),
            selectedDay,
            priceType,
        };

        try {
            await registerClientUseCase.execute(data);
            await confirmForm();
        } catch (error) {
            const status = error?.status;

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

    /**
     * Muestra una alerta de confirmación antes de cancelar el formulario.
     * Si el usuario confirma, navega a la vista de información de clientes
     * descartando todos los cambios no guardados.
     *
     * @returns {Promise<void>}
     */
    const cancelForm = async () => {
        const result = await ConfirmAlert({
            title: "¿Estas seguro que deseas salir del formulario?",
            text: "Se perderán los cambios no guardados.",
            confirmText: "Sí, cancelar",
            cancelText: "Seguir editando",
        });

        if (result.isConfirmed) {
            navigate("/ruta");
        }
    };

    /**
     * Muestra una alerta de éxito tras completar el registro del cliente.
     * Si el usuario confirma, navega a la vista de información de clientes.
     *
     * @returns {Promise<void>}
     */
    const confirmForm = async () => {
        const result = await AceptAlert({
            title: "¡Cliente registrado con éxito!",
            confirmText: "De acuerdo",
        });

        if (result.isConfirmed) {
            navigate("/ruta");
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
        validateField,
        nameRef, lastname1Ref, 
        emailRef, phoneRef, addressRef,
    };
}

export default useRegisterClientViewModel;
export { validateForm };