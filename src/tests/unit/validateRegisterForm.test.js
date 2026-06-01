import { validateForm } from '../../../src/presentation/viewmodels/admin/registerClientViewModel';

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));


jest.mock("axios", () => ({
    create: jest.fn(() => ({
        interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() }
        },
        post: jest.fn(),
        get: jest.fn(),
    }))
}));

jest.mock("../../api/axiosConfig", () => ({
    __esModule: true,
    default: { post: jest.fn(), get: jest.fn() },
    setAccessToken: jest.fn()
}));

describe('validateForm', () => {

    test('Debe pasar con datos válidos', () => {
        const result = validateForm(
            "Juan",
            "Pérez",
            "",
            "juan@test.com",
            "4421234567",
            "Calle 123 #45",
            "",
            "",
            ""
        );

        expect(result.hasErrors).toBe(false);
        expect(result.errors).toEqual({
            name: "",
            lastname1: "",
            lastname2: "",
            email: "",
            phone: "",
            address: "",
            pets: "",
            family: "",
            notes: "",
        });
    });

    test('Debe fallar si el nombre está vacío', () => {
        const result = validateForm(
            "",
            "Pérez",
            "",
            "juan@test.com",
            "4421234567",
            "Calle 123",
            "",
            "",
            ""
        );

        expect(result.hasErrors).toBe(true);
        expect(result.errors.name).toBe("El nombre del cliente es requerido.");
    });

    test('Debe fallar con email inválido', () => {
        const result = validateForm(
            "Juan",
            "Pérez",
            "correo-malo",
            "4421234567",
            "Calle 123"
        );

        expect(result.errors.email).toBe("Ingresa un correo válido.");
    });

    test('Debe fallar con teléfono inválido', () => {
        const result = validateForm(
            "Juan",
            "Pérez",
            "juan@test.com",
            "123",
            "Calle 123"
        );

        expect(result.errors.phone).toBe("Ingresa un teléfono válido.");
    });

    test('Debe fallar con dirección inválida', () => {
        const result = validateForm(
            "Juan",
            "Pérez",
            "",
            "juan@test.com",
            "4421234567",
            "x",
            "",
            "",
            ""
        );

        expect(result.errors.address).toBe("Ingresa una dirección válida.");
    });

});