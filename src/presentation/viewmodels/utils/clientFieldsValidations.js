/**
 * Validaciones de datos para la modificación de clientes
 * @returns {Boolean} -  valor válido / no válido
 */

const MAX_BALANCE = 1000000;
const MIN_BALANCE = -1000000;
const MAX_TEXT_LENGTH = 500;
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

export const validateFirstName = (value) => {
    const text = normalize(value);

    if (!text) return "El nombre es requerido.";

    if (text.length > 100) {
        return "El campo nombre es demasiado largo.";
    }

    const nameRegex = /^[A-Za-zÀ-ÿ\s.'-]+$/;

    if (!nameRegex.test(text)) return "El campo nombre debe ser válido.";

    return true;
};

export const validateLastName = (value) => {
    const text = normalize(value);

    if (!text) return "El apellido es requerido.";

    if (text.length > 100) {
        return "El campo apellido es demasiado largo.";
    }

    const nameRegex = /^[A-Za-zÀ-ÿ\s.'-]+$/;

    if (!nameRegex.test(text)) return "El campo apellido debe ser válido.";

    return true;
};

export const validateText = (value, fieldName) => {
    if (value === null || value === undefined || value === '') {
        return true;
    }

    const text = String(value);

    if (text.trim() === '') {
        return `El campo ${fieldName} no puede contener solo espacios.`;
    }

    if (text.trim().length > 100) {
        return `El campo ${fieldName} es demasiado largo.`;
    }

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

export const validateEmail = (value, emails=[], userId) => {
    if (!value) return "El correo electrónico es requerido.";

    for (const email of emails) {
        if (email.correo.toLowerCase() === value.toLowerCase() && userId !== email.id_usuario) {
            return "Este correo electrónico ya está registrado.";
        }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Ingresa un correo electrónico válido.";
    
    return true;
}

export const validateField = (field, value, emails=[], userId=[]) => {

    switch (field) {
        case "balance":
            return validateBalance(value);

        case "firstName":
            return validateFirstName(value);

        case "lastName":
            return validateLastName(value);

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
            return validateEmail(value, emails, userId);

        default:
            return true;
    }
};