// Permite:
// - letras
// - números
// - espacios
// - acentos
export function isValidSearchText(text) {
    const regex = /^[a-zA-ZÀ-ÿ0-9\s]*$/;

    return regex.test(text);
}