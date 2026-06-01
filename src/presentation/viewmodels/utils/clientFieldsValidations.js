/**
 * Validaciones de datos para la modificación de clientes
 * @returns {Boolean} -  valor válido / no válido
 */

export const validateBalance = (value) => {
    if (value === null || value === undefined) return "El saldo es obligatorio.";

    if (isNaN(value)) return "El saldo debe ser un número.";

    if(value > 1000000) return "El saldo es mayor al máximo permitido";

    return true;
};

export const validateNotes = (value) => {

    if (value === null) return true;

    if (value.length > 255) return "Ingresa máximo 255 caracteres.";

    return true;
};

export const validatePhone = (value) => {
    if (!value) return "El teléfono es requerido.";

    const phoneRegex = /^(\+52[\s-]?)?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/;

    if (!phoneRegex.test(value)) return "Ingresa un teléfono válido.";

    return true;
};

export const validateAddress = (value) => {
    if (!value) return "La dirección es requerida.";

    const addressRegex = /^[a-zA-ZÀ-ÿ0-9\s.,#-]{5,150}$/;

    if (!addressRegex.test(value)) return "Ingresa una dirección válida";

    return true;
};

export const validateText = (value, fieldName) => {
    if (!value) return ` Campo ${fieldName} es requerido.`;

    if (value.length > 100) return `${fieldName} demasiado largo.`;

    return true;
};

export const validateOrder = (value) => {
    if (!value) return "El orden es requerido.";

    if(value < 0) return "El orden no puede ser negativo.";

    if(value == 0) return "El orden no puede ser 0.";

    if(value >= 100) return "El orden es demasiado grande.";

    return true;
}

export const validateEmail = (value) => {
    if (!value) return "El correo electrónico es requerido.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Ingresa un correo electrónico válido.";
    
    return true;
}

export const validateField = (field, value) => {

    switch (field) {
        case "balance":
            return validateBalance(value);

        case "notes":
            return validateNotes(value);

        case "cellphone":
            return validatePhone(value);

        case "address":
            return validateAddress(value);

        case "pets":
            return validateText(value, "Mascotas");

        case "family":
            return validateText(value, "Familia");

        case "order":
            return validateOrder(value);

        case "email":
            return validateEmail(value);

        default:
            return true;
    }
};