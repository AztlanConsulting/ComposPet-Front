import axios from 'axios';

let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token);
    });

    failedQueue = [];
};

/**
 * Verifica si el usuario tiene una sesión activa basada en la presencia del access token.
 * @returns {boolean} True si hay un token de acceso disponible.
 */
export const isAuthenticated = () => {
    return Boolean(accessToken);
};

/**
 * Instancia base de Axios configurada para el sistema ComposPet.
 * Incluye la URL base y permite el envío automático de cookies.
 * La cookie httpOnly refreshToken viaja automáticamente por withCredentials.
 *
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, 
    withCredentials: true,
});

/**
 * Actualiza el token de acceso en memoria.
 * @param {string|null|undefined} token - Nuevo JWT emitido por el servidor.
 */
export const setAccessToken = (token) => {
    accessToken = token || null;
};

/**
 * Limpia el token de acceso en memoria.
 */
export const clearAccessToken = () => {
    accessToken = null;
};

/**
 * Limpia datos locales de sesión.
 */
const clearLocalSession = () => {
    accessToken = null;
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authProvider');
};

/**
 * Redirige al login cuando la sesión ya no es válida.
 */
const redirectToLogin = () => {
    if (window.location.pathname !== '/inicio-sesion') {
        window.location.href = '/inicio-sesion';
    }
};

/**
 * Refresca el access token usando la cookie httpOnly refreshToken.
 * Si ya hay un refresh en curso, las demás peticiones esperan el mismo resultado.
 *
 * @returns {Promise<string>} Nuevo accessToken.
 */
export const refreshAccessToken = async () => {
    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;

    try {
        const { data } = await api.post('/refresh');

        accessToken = data.accessToken || null;

        if (!accessToken) {
            throw new Error('No accessToken returned from refresh endpoint');
        }

        processQueue(null, accessToken);

        return accessToken;
    } catch (error) {
        processQueue(error, null);
        clearLocalSession();
        throw error;
    } finally {
        isRefreshing = false;
    }
};

/**
 * Interceptor de peticiones:
 * - Si hay accessToken, lo agrega en Authorization.
 * - Si no hay accessToken pero existe usuario en sessionStorage,
 *   intenta restaurar la sesión con /refresh antes de enviar la petición protegida.
 */
api.interceptors.request.use(
    async (config) => {
        config.headers = config.headers || {};

        const url = config.url || '';

        const isRefreshRequest = url.includes('/refresh');
        const isLoginRequest = url.includes('/inicio-sesion');
        const hasStoredUser = Boolean(sessionStorage.getItem('user'));

        if (!accessToken && hasStoredUser && !isRefreshRequest && !isLoginRequest) {
            try {
                await refreshAccessToken();
            } catch (error) {
                clearLocalSession();
            }
        }

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Interceptor de respuestas:
 * Si el backend indica que el access token expiró, intenta refrescarlo
 * y reintenta una sola vez la petición original.
 */
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest?.url?.includes('/refresh')) {
            clearLocalSession();
            redirectToLogin();
            return Promise.reject(error);
        }

        const isTokenExpired = error.response?.data?.error === 'TOKEN_EXPIRED';

        if (
            error.response?.status === 401 &&
            isTokenExpired &&
            !originalRequest?._retry
        ) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (err) {
                clearLocalSession();
                redirectToLogin();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;