import { render, screen } from '@testing-library/react';
import React from 'react';

/**
 * Mock de axios para evitar peticiones HTTP reales durante las pruebas.
 * Se simulan los interceptores y los métodos HTTP principales para que
 * la inicialización del cliente HTTP de la aplicación no falle al renderizar.
 */
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() }
        },
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }))
}));

/**
 * Mock de la librería de autenticación con Google.
 * `GoogleOAuthProvider` se reemplaza por un wrapper transparente para evitar
 * que la suite requiera un `clientId` real configurado en variables de entorno.
 */
jest.mock('@react-oauth/google', () => ({
    GoogleOAuthProvider: ({ children }) => children,
    useGoogleLogin: () => jest.fn(),
}));

/**
 * Mocks de componentes de enrutamiento y vistas.
 * `ProtectedRoute` y `LoginView` se neutralizan para aislar el árbol de componentes
 * de dependencias de autenticación y navegación que no son relevantes en esta prueba.
 * Los componentes de `react-router-dom` se reemplazan por wrappers transparentes
 * que renderizan sus hijos directamente, evitando la necesidad de un contexto de Router real.
 */
jest.mock('./utilities/ProtectedRoute', () => () => null);
jest.mock('./presentation/views/auth/LoginView', () => () => null);

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return {
        ...actual,
        BrowserRouter: ({ children }) => children,
        Routes: ({ children }) => children,
        Route: ({ element }) => element,
        useNavigate: () => jest.fn(),
    };
});

import App from './App';

const originalWarn = console.warn;

/**
 * Suprime advertencias esperadas de React Router durante la ejecución de la suite.
 * Se filtran los avisos de flags futuros y rutas no encontradas que son irrelevantes
 * en el contexto de pruebas y ensuciarían la salida de la consola.
 * El resto de advertencias se conservan para no ocultar problemas reales.
 */
beforeAll(() => {
    console.warn = (...args) => {
        const warningMessage = args[0];
        if (
            typeof warningMessage === 'string' &&
            (warningMessage.includes('React Router Future Flag Warning') ||
                warningMessage.includes('No routes matched location'))
        ) {
            return;
        }
        originalWarn(...args);
    };
});

/**
 * Restaura `console.warn` a su implementación original al finalizar la suite
 * para no afectar otras suites que se ejecuten en el mismo proceso.
 */
afterAll(() => {
    console.warn = originalWarn;
});

/**
 * Verifica que el componente raíz `App` se monta sin errores.
 * Es una prueba de humo que garantiza que la configuración de rutas,
 * proveedores y contextos no produce un fallo en el render inicial.
 */
test('App se renderiza sin errores', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
});