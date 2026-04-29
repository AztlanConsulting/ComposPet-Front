/**
 * Procesa errores de Axios y los convierte en errores legibles.
 * @param {import('axios').AxiosError} error - El error capturado.
 * @throws {Error} Mensaje de error estandarizado.
 */
// infrastructure/httpErrorHandler.js

export class HttpError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
    }
}

export const handleHttpError = (error) => {
    if (error.response) {
        const message = error.response.data?.message || `Error: ${error.response.status}`;
        throw new HttpError(message, error.response.status);
    } else if (error.request) {
        throw new HttpError("No se pudo conectar con el servidor. Revisa tu conexión.", 0);
    } else {
        throw new HttpError("Error interno al procesar la solicitud.", -1);
    }
};