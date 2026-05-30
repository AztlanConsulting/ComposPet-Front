/**
 * Validaciones de datos para la modificación de clientes
 * @returns {Boolean} -  valor válido / no válido
 */

const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

export const validateCollected = (value) => {
    if (value === null || value === undefined) return "Las cubetas son obligatorias.";

    if (isNaN(value)) return "El número de cubetas debe de ser un número.";

    if (value < 0) return "El número de cubetas debe de ser positivo.";

    if (value > 20) return "Las cubetas a recolectar no pueden ser más de 20.";

    return true;
}

export const validateDelivered = (value) => {
    if (value === null || value === undefined) return "Las cubetas son obligatorias.";

    if (isNaN(value)) return "El número de cubetas debe de ser un número.";

    if (value < 0) return "El número de cubetas debe de ser positivo.";

    if (value > 20) return "Las cubetas a entregar no pueden ser más de 20.";

    return true;
}

export const validatePaid = (value) => {
    if (isNaN(value)) return "El total pagado debe de ser un número.";

    if (value < 0) return "El total pagado debe de ser positivo.";

    if (value > 1000000) return "Ingrese un valor real.";

    return true;
}

export const validateNotes = (value) => {
    if (value === null || value === undefined) return true;

    if (emojiRegex.test(value)) return "Las notas no pueden contener emojis.";

    if (value.length > 255) return "Ingresa máximo 255 caracteres.";

    return true;
};

export const validateSchedule = (value) => {
    if (value === null || value === undefined) return true;

    if (emojiRegex.test(value)) return "El horario no puede contener emojis.";

    const timeRegex = /^(0[1-9]|1[0-2]):[0-5]\d$/;

    if (!timeRegex.test(value)) return "Ingresa un horario con el formato HH:MM (12 hrs.)";

    return true;
}

export const validateField = (field, value) => {
    switch (field) {
        case "collectedBuckets":
            return validateCollected(value);

        case "deliveredBuckets":
            return validateDelivered(value);

        case "notes":
            return validateNotes(value);

        case "schedule":
            return validateSchedule(value);

        case "paid":
            return validatePaid(value);

        default:
            return true;
    }
};