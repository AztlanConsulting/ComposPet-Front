export const sanitizeText = (value) => {
    return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9\s.,;:@_\-]/g, '');
};

export const sanitizeEmail = (value) => {
    return value.replace(/[^a-zA-Z0-9@._\-]/g, '');
};

export const sanitizePhone = (value) => {
    return value.replace(/[^0-9\+\-\s]/g, '');
};