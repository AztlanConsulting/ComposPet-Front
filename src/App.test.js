import { render, screen } from '@testing-library/react';
import App from './App';

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
    GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
    useGoogleLogin: () => jest.fn()
}));

/**
 * Verifica que el componente raíz `App` se monta sin errores.
 * Es una prueba de humo que garantiza que la configuración inicial
 * de rutas, proveedores y contextos no produce un fallo en el render.
 */
test('renders learn react link', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
});

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