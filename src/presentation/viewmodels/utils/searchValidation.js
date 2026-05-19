// Permite:
// - letras
// - números
// - espacios
// - acentos
export function isValidSearchText(text) {
    const regex = /^[a-zA-ZÀ-ÿ\s]*$/;

    return regex.test(text);
}