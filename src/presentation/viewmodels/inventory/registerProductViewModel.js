import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import ConfirmAlert from '../../../components/Template/confirmationAlert';
import AceptAlert from '../../../components/Template/AceptAlert';
import ProblemAlert from '../../../components/Template/ProblemAlert';

import { registerProductUseCase } from '../../../di/inventory/registerProductDependencies';

/**
 * Valida los campos del formulario de registro de productos.
 *
 * @param {string} name - Nombre del producto.
 * @param {string|number} price - Precio del producto.
 * @param {string|number} quantity - Cantidad disponible.
 * @param {string} color - Color hexadecimal del producto.
 * @param {string} description - Descripción opcional del producto.
 * @param {string} imageUrl - URL opcional de imagen.
 * @returns {{ errors: Object, hasErrors: boolean }} Errores del formulario.
 */
function validateForm(name, price, quantity, color, description, imageUrl) {
    const errors = {
        name: "",
        price: "",
        quantity: "",
        color: "",
        description: "",
        imageUrl: "",
    };

    let hasErrors = false;

    const invalidCharacters = /[<>"'%;()&+]/;
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;

    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (!name) {
        errors.name = "El nombre del producto es requerido.";
        hasErrors = true;
    } else if (name.length > 60) {
        errors.name = "El nombre no puede exceder 60 caracteres.";
        hasErrors = true;
    } else if (invalidCharacters.test(name)) {
        errors.name = "El nombre contiene caracteres inválidos.";
        hasErrors = true;
    } else if (emojiRegex.test(name)) {
        errors.name = "El nombre no puede contener emojis.";
        hasErrors = true;
    }

    if (price === "" || price === null || price === undefined) {
        errors.price = "El precio es requerido.";
        hasErrors = true;
    } else if (!Number.isFinite(numericPrice)) {
        errors.price = "El precio debe ser un número válido.";
        hasErrors = true;
    } else if (numericPrice <= 0) {
        errors.price = "El precio debe ser mayor a 0.";
        hasErrors = true;
    }

    if (quantity === "" || quantity === null || quantity === undefined) {
        errors.quantity = "La cantidad es requerida.";
        hasErrors = true;
    } else if (!Number.isInteger(numericQuantity)) {
        errors.quantity = "La cantidad debe ser un número entero.";
        hasErrors = true;
    } else if (numericQuantity < 0) {
        errors.quantity = "La cantidad no puede ser negativa.";
        hasErrors = true;
    }

    if (!color) {
        errors.color = "El color es requerido.";
        hasErrors = true;
    } else if (!hexColorRegex.test(color)) {
        errors.color = "El color debe tener formato hexadecimal.";
        hasErrors = true;
    }

    if (description) {
        if (description.length > 255) {
            errors.description = "La descripción no puede exceder 255 caracteres.";
            hasErrors = true;
        } else if (invalidCharacters.test(description)) {
            errors.description = "La descripción contiene caracteres inválidos.";
            hasErrors = true;
        } else if (emojiRegex.test(description)) {
            errors.description = "La descripción no puede contener emojis.";
            hasErrors = true;
        }
    }

    if (imageUrl) {
        try {
            new URL(imageUrl);
        } catch {
            errors.imageUrl = "Ingresa una URL de imagen válida.";
            hasErrors = true;
        }
    }

    return { errors, hasErrors };
}

/**
 * ViewModel para el formulario de registro de un nuevo producto.
 * Gestiona el estado de los campos, la validación, el envío de datos
 * y las alertas de confirmación, éxito y error.
 */
function useRegisterProductViewModel() {
    const [errors, setErrors] = useState({
        name: "",
        price: "",
        quantity: "",
        color: "",
        description: "",
        imageUrl: "",
    });

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [color, setColor] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const nameRef = useRef(null);
    const priceRef = useRef(null);
    const quantityRef = useRef(null);
    const colorRef = useRef(null);
    const descriptionRef = useRef(null);
    const imageUrlRef = useRef(null);

    const navigate = useNavigate();

    const hasUnsavedChanges =
        name || price || quantity || color || description || imageUrl;

    const validateField = (field, value) => {
        const updatedValues = {
            name,
            price,
            quantity,
            color,
            description,
            imageUrl,
            [field]: value,
        };

        const { errors: newErrors } = validateForm(
            updatedValues.name,
            updatedValues.price,
            updatedValues.quantity,
            updatedValues.color,
            updatedValues.description,
            updatedValues.imageUrl
        );

        setErrors(prev => ({
            ...prev,
            [field]: newErrors[field],
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedColor = color.trim();
        const trimmedDescription = description.trim();
        const trimmedImageUrl = imageUrl.trim();

        const validation = validateForm(
            trimmedName,
            price,
            quantity,
            trimmedColor,
            trimmedDescription,
            trimmedImageUrl
        );

        if (validation.hasErrors) {
            setErrors(validation.errors);

            if (validation.errors.name && nameRef.current) {
                nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                nameRef.current.focus();
            } else if (validation.errors.price && priceRef.current) {
                priceRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                priceRef.current.focus();
            } else if (validation.errors.quantity && quantityRef.current) {
                quantityRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                quantityRef.current.focus();
            } else if (validation.errors.color && colorRef.current) {
                colorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                colorRef.current.focus();
            } else if (validation.errors.description && descriptionRef.current) {
                descriptionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                descriptionRef.current.focus();
            } else if (validation.errors.imageUrl && imageUrlRef.current) {
                imageUrlRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                imageUrlRef.current.focus();
            }

            return;
        }

        const data = {
            name: trimmedName,
            price: Number(price),
            quantity: Number(quantity),
            color: trimmedColor,
            description: trimmedDescription || null,
            imageUrl: trimmedImageUrl || null,
        };

        try {
            await registerProductUseCase.execute(data);
            await confirmForm();
        } catch (error) {
            const status = error?.status;

            if (status === 409) {
                await ProblemAlert({
                    title: "Producto ya registrado",
                    text: "Ya existe un producto registrado con este nombre.",
                    confirmText: "Entendido",
                });
            } else {
                await ProblemAlert({
                    title: "Error",
                    text: "Ocurrió un error inesperado. Intenta de nuevo más tarde.",
                    confirmText: "Entendido",
                });
            }
        }
    };

    const cancelForm = async () => {
        const result = await ConfirmAlert({
            title: "¿Estás seguro que deseas salir del formulario?",
            text: "Se perderán los cambios no guardados.",
            confirmText: "Sí, cancelar",
            cancelText: "Seguir editando",
        });

        if (result.isConfirmed) {
            navigate("/inventario");
        }
    };

    const confirmForm = async () => {
        const result = await AceptAlert({
            title: "Producto registrado",
            text: "El producto se registró exitosamente.",
            confirmText: "Aceptar",
        });

        if (result.isConfirmed) {
            navigate("/inventario");
        }
    };

    return {
        errors,

        name,
        setName,
        price,
        setPrice,
        quantity,
        setQuantity,
        color,
        setColor,
        description,
        setDescription,
        imageUrl,
        setImageUrl,

        nameRef,
        priceRef,
        quantityRef,
        colorRef,
        descriptionRef,
        imageUrlRef,

        validateField,
        handleSubmit,
        cancelForm,
        confirmForm,
    };
}

export default useRegisterProductViewModel;