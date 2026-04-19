/**
 * Procesa errores de Axios y los convierte en errores legibles.
 * @param {import('axios').AxiosError} error - El error capturado.
 * @throws {Error} Mensaje de error estandarizado.
 */
export const handleHttpError = (error) => {
    if (error.response) {
        const message = error.response.data?.message || `Error: ${error.response.status}`;
        throw new Error(message);
    } else if (error.request) {
        throw new Error("No se pudo conectar con el servidor. Revisa tu conexión.");
    } else {
        throw new Error("Error interno al procesar la solicitud.");
    }
};