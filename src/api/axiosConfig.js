import axios from 'axios';

let accessToken = null;

/**
 * Verifica si el usuario tiene una sesión activa basada en la presencia del token.
 * @returns {boolean} True si hay un token de acceso disponible.
 */
export const isAuthenticated = () => {
    return accessToken !== null; 
};

/**
 * Instancia base de Axios configurada para el sistema ComposPet.
 * Incluye la URL base y permite el envío automático de cookies (para el Refresh Token).
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  withCredentials: true,
});

/**
 * Actualiza el token de acceso en memoria.
 * @param {string} token - Nuevo JWT emitido por el servidor.
 */
export const setAccessToken = (token) => {
    accessToken = token;
};

/**
 * Interceptor de Peticiones:
 * Inyecta el token de acceso en el header Authorization de forma automática.
 */
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

/**
 * Interceptor de Respuestas:
 * Gestiona la renovación automática de tokens cuando se recibe un error 401 (Unauthorized).
 * Implementa una estrategia de reintento único para evitar bucles infinitos.
 * * @async
 * @param {import('axios').AxiosResponse} response - Respuesta exitosa.
 * @param {Error} error - Objeto de error de Axios.
 * @throws {Error} Rechaza la promesa si la renovación falla o el error no es 401.
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await api.post('/api/refresh');

                accessToken = data.accessToken;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                
                return api(originalRequest);
            } catch (err) {
                accessToken = null;
                sessionStorage.removeItem('user'); 
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;