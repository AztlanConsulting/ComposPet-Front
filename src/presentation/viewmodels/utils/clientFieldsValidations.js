/**
 * Validaciones de datos para la modificación de clientes
 * @returns {Boolean} -  valor válido / no válido
 */

const MAX_BALANCE = 1000000;
const MIN_BALANCE = -1000000;
const MAX_TEXT_LENGTH = 255;
const normalize = (value) => String(value ?? '').trim();

export const validateBalance = (value) => {
    if (value === null || value === undefined) return "El saldo es obligatorio.";

    if (isNaN(value)) return "El saldo debe ser un número.";

    if(value > MAX_BALANCE) return "El saldo es mayor al máximo permitido";

    if(value < MIN_BALANCE) return "El saldo es menor al mínimo permitido";

    return true;
};

export const validateNotes = (value) => {
    const text = normalize(value);

    if (!text) return true;

    if (text.length > MAX_TEXT_LENGTH) {
        return `El campo notas permite máximo ${MAX_TEXT_LENGTH} caracteres.`;
    }

    return true;
};

export const validatePhone = (value) => {
    const text = normalize(value);

    if (!text) return "El campo teléfono es requerido.";

    const phoneRegex = /^\+?\d{10,15}$/;

    if (!phoneRegex.test(text)) return "El campo teléfono debe ser válido.";

    return true;
};

export const validateAddress = (value) => {
    const text = normalize(value);

    if (!text) return "El campo dirección es requerido.";

    const addressRegex = /^(?=.*[A-Za-zÀ-ÿ])[A-Za-zÀ-ÿ0-9.,#\-\s]{5,150}$/;

    if (!addressRegex.test(text)) return "El campo dirección debe ser válido.";

    return true;
};

export const validateText = (value, fieldName) => {
    const text = normalize(value);

    if (!text) return `El campo ${fieldName} es requerido.`;

    if (text.length > 100) return `El campo ${fieldName} es demasiado largo.`;

    return true;
};

export const validateOrder = (value) => {
    const text = normalize(value);

    if (!text) return "El campo orden es requerido.";

    const order = Number(text);

    if (isNaN(order)) return "El campo orden debe ser un número.";
    if (order < 0) return "El campo orden no puede ser negativo.";
    if (order === 0) return "El campo orden no puede ser 0.";
    if (order >= 100) return "El campo orden es demasiado grande.";

    return true;
};

export const validateEmail = (value) => {
    const text = normalize(value);

    if (!text) return "El campo correo electrónico es requerido.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(text)) return "El campo correo electrónico debe ser válido.";

    return true;
};
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
            return validateText(value, "mascotas");
        
        case "family":
            return validateText(value, "familia");

        case "order":
            return validateOrder(value);

        case "email":
            return validateEmail(value);

        default:
            return true;
    }
};