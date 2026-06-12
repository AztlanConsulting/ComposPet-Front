import { useState, useEffect, useRef } from 'react';

import ConfirmAlert from '../../../components/Template/confirmationAlert';
import AceptAlert from '../../../components/Template/AceptAlert';
import ProblemAlert from '../../../components/Template/ProblemAlert';

import { registerProductUseCase, updateProductUseCase } from '../../../di/inventory/registerProductDependencies';
import ALLOWED_PRODUCT_COLORS from '../../../utilities/productColors';

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
function validateForm(name, price, quantity, color, description, imageFile, mode = "create") {
    const errors = {
        name: "",
        price: "",
        quantity: "",
        color: "",
        description: "",
        imageFile: "",
    };

    let hasErrors = false;

    const validNameRegex = /^[\p{L}\p{N}\s.()\-]+$/u;
    const validDescriptionRegex = /^[\p{L}\p{N}\s.,;:()\-]+$/u;    
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 
    'image/svg', 'image/avif', 'image/jpg', 'image/heic'];
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
    } else if (numericPrice < 0) {
        errors.price = "El precio debe ser igual o mayor a 0.";
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
    } else if (mode == "create" && numericQuantity < 0) {
        errors.quantity = "La cantidad no puede ser negativa.";
        hasErrors = true;
    } else if (numericQuantity > 999) {
        errors.quantity = "La cantidad no puede ser mayor a 999.";
        hasErrors = true;
    }

    if (!color) {
        errors.color = "El color es requerido.";
        hasErrors = true;
    } else if (!ALLOWED_PRODUCT_COLORS.includes(color)) {
        errors.color = "El color seleccionado no es válido.";
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
            errors.imageFile = "La imagen debe ser JPG, JPEG, SVG, AVIF, HEIC, PNG o WEBP.";
            hasErrors = true;
        } else if (imageFile.size > MAX_IMAGE_SIZE) {
            errors.imageFile = "La imagen no puede exceder 2 MB.";
            hasErrors = true;
        }
    }

    return { errors, hasErrors };
}

function useRegisterProductViewModel({
    mode = "create",
    initialProduct = null,
    onClose = () => {},
    onProductRegistered = async () => {},
    } = {}) {
    const [errors, setErrors] = useState({
        name: "",
        price: "",
        quantity: "",
        color: "",
        description: "",
        imageFile: "",
    });

    const [name, setName] = useState(initialProduct?.name || '');
    const [price, setPrice] = useState(initialProduct?.price ?? '');
    const [quantity, setQuantity] = useState(initialProduct?.quantity ?? '');
    const [color, setColor] = useState(
        initialProduct?.color || ALLOWED_PRODUCT_COLORS[0]
    );
    const [description, setDescription] = useState(
        initialProduct?.description || ''
    );
    const [imageFile, setImageFile] = useState(null);
    const [isPriceFocused, setIsPriceFocused] = useState(false);

    const nameRef = useRef(null);
    const priceRef = useRef(null);
    const quantityRef = useRef(null);
    const colorRef = useRef(null);
    const descriptionRef = useRef(null);
    const imageFileRef = useRef(null);

    const hasUnsavedChanges =
        mode === "create"
            ? (name || price || quantity || description || imageFile)
            : (
                name !== (initialProduct?.name || '') ||
                Number(price) !== Number(initialProduct?.price ?? '') ||
                Number(quantity) !== Number(initialProduct?.quantity ?? '') ||
                color !== (initialProduct?.color || ALLOWED_PRODUCT_COLORS[0]) ||
                description !== (initialProduct?.description || '') ||
                imageFile !== null
            );

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
            updatedValues.imageFile,
            mode,
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
            imageFile,
            mode,
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

            if (mode === "create") {
                await registerProductUseCase.execute(data);
            } else {
                await updateProductUseCase.execute(
                    initialProduct.productId,
                    data
                );
            }

            resetForm();
            await confirmForm();
            await onProductRegistered();
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
            resetForm();
            onClose();
        }
    };

    const confirmForm = async () => {
        await AceptAlert({
            title: mode === "create"
                ? "Producto registrado"
                : "Producto actualizado",

            text: mode === "create"
                ? "El producto se registró exitosamente."
                : "El producto se actualizó exitosamente.",

            confirmText: "Aceptar",
        });
    };

    const resetForm = () => {
        setErrors({
            name: "",
            price: "",
            quantity: "",
            color: "",
            description: "",
            imageFile: "",
        });
    
        if (mode === "create") {
            setName('');
            setPrice('');
            setQuantity('');
            setColor(ALLOWED_PRODUCT_COLORS[0]);
            setDescription('');
        } else {
            setName(initialProduct?.name || '');
            setPrice(initialProduct?.price ?? '');
            setQuantity(initialProduct?.quantity ?? '');
            setColor(initialProduct?.color || ALLOWED_PRODUCT_COLORS[0]);
            setDescription(initialProduct?.description || '');
        }

        setImageFile(null);
        setIsPriceFocused(false);
    };

    useEffect(() => {
        if (mode === "edit" && initialProduct) {
            setName(initialProduct.name || '');
            setPrice(initialProduct.price ?? '');
            setQuantity(initialProduct.quantity ?? '');
            setColor(
                initialProduct.color || ALLOWED_PRODUCT_COLORS[0]
            );
            setDescription(initialProduct.description || '');
            setImageFile(null);

            setErrors({
                name: "",
                price: "",
                quantity: "",
                color: "",
                description: "",
                imageFile: "",
            });
        }
    }, [initialProduct, mode]);

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
        resetForm,

        isPriceFocused,
        setIsPriceFocused,
    };
}

export default useRegisterProductViewModel;