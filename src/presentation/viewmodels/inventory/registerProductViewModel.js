import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import ConfirmAlert from '../../../components/Template/confirmationAlert';
import AceptAlert from '../../../components/Template/AceptAlert';
import ProblemAlert from '../../../components/Template/ProblemAlert';

import { RegisterProductUseCase } from '../../../domain/useCases/registerProductUseCase';

/**
 * Valida los campos del formulario de registro de producto.
 * - name: requerido, máximo 60 caracteres, sin caracteres especiales ni emojis.
 * - price: requerido, número válido mayor a 0.
 * - quantity: requerido, número entero no negativo.
 * - color: requerido, formato hexadecimal (#RRGGBB).
 * - description: opcional, máximo 255 caracteres, sin caracteres especiales ni emojis.
 * - imageFile: opcional, tipo JPG/PNG/WEBP, máximo 2 MB.
 * 
 * @param {string} name - El nombre del producto.
 * @param {string} price - El precio del producto.
 * @param {string} quantity - La cantidad del producto.
 * @param {string} color - El color del producto en formato hexadecimal.
 * @param {string} description - La descripción del producto.
 * @param {File} imageFile - El archivo de imagen del producto.
 * 
 * @return {Object} Un objeto con los errores de validación y un booleano indicando si hay errores.
 */
function validateForm(name, price, quantity, color, description, imageFile) {
    const errors = {
        name: "",
        price: "",
        quantity: "",
        color: "",
        description: "",
        imageFile: "",
    };

    let hasErrors = false;

    const validNameRegex = /^[\p{L}\p{N}\s]+$/u;
    const validDescriptionRegex = /^[\p{L}\p{N}\s.,;:()\-]+$/u;    
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

    const numericPrice = Number(price);
    const numericQuantity = Number(quantity);

    if (!name) {
        errors.name = "El nombre del producto es requerido.";
        hasErrors = true;
    } else if (name.length > 60) {
        errors.name = "El nombre no puede exceder 60 caracteres.";
        hasErrors = true;
    } else if (!validNameRegex.test(name)) {
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
    } else if (numericPrice > 100000) {
        errors.price = "El precio no puede exceder $100,000.00.";
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
    } else if (numericQuantity > 999) {
        errors.quantity = "La cantidad no puede ser mayor a 999.";
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
        } else if (!validDescriptionRegex.test(description)) {
            errors.description = "La descripción contiene caracteres inválidos.";
            hasErrors = true;
        } else if (emojiRegex.test(description)) {
            errors.description = "La descripción no puede contener emojis.";
            hasErrors = true;
        }
    }

    if (imageFile) {
        if (!allowedImageTypes.includes(imageFile.type)) {
            errors.imageFile = "La imagen debe ser JPG, PNG o WEBP.";
            hasErrors = true;
        } else if (imageFile.size > MAX_IMAGE_SIZE) {
            errors.imageFile = "La imagen no puede exceder 2 MB.";
            hasErrors = true;
        }
    }

    return { errors, hasErrors };
}

function useRegisterProductViewModel() {
    const [errors, setErrors] = useState({
        name: "",
        price: "",
        quantity: "",
        color: "",
        description: "",
        imageFile: "",
    });

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [color, setColor] = useState('#169B49');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isPriceFocused, setIsPriceFocused] = useState(false);

    const nameRef = useRef(null);
    const priceRef = useRef(null);
    const quantityRef = useRef(null);
    const colorRef = useRef(null);
    const descriptionRef = useRef(null);
    const imageFileRef = useRef(null);

    const navigate = useNavigate();

    const hasUnsavedChanges =
        name || price || quantity || color || description || imageFile;

    const validateField = (field, value) => {
        const updatedValues = {
            name,
            price,
            quantity,
            color,
            description,
            imageFile,
            [field]: value,
        };

        const { errors: newErrors } = validateForm(
            updatedValues.name,
            updatedValues.price,
            updatedValues.quantity,
            updatedValues.color,
            updatedValues.description,
            updatedValues.imageFile
        );

        setErrors(prev => ({
            ...prev,
            [field]: newErrors[field],
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files?.[0] || null;

        setImageFile(file);
        validateField('imageFile', file);
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

        const validation = validateForm(
            trimmedName,
            price,
            quantity,
            trimmedColor,
            trimmedDescription,
            imageFile
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
            } else if (validation.errors.imageFile && imageFileRef.current) {
                imageFileRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                imageFileRef.current.focus();
            }

            return;
        }

        const data = {
            name: trimmedName,
            price: Number(price),
            quantity: Number(quantity),
            color: trimmedColor,
            description: trimmedDescription || null,
            imageFile,
        };

        try {
            await RegisterProductUseCase.execute(data);
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
        imageFile,
        setImageFile,

        nameRef,
        priceRef,
        quantityRef,
        colorRef,
        descriptionRef,
        imageFileRef,

        validateField,
        handleImageChange,
        handleSubmit,
        cancelForm,
        confirmForm,

        isPriceFocused,
        setIsPriceFocused,
    };
}

export default useRegisterProductViewModel;