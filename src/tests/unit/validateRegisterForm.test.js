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

    test('Debe fallar si el apellido 1 es inválido', () => {
        const result = validateForm(
            "Alejandra",
            "Arredondo❓",
            "",
            "juan@test.com",
            "4421234567",
            "Calle 123",
            "",
            "",
            ""
        );

        expect(result.hasErrors).toBe(true);
        expect(result.errors.lastname1).toBe("Solo puedes ingresar letras mayúsculas y minúsculas.");
    });

    test('Debe fallar si el apellido 2 es inválido', () => {
        const result = validateForm(
            "Alejandra",
            "Arredondo  ",
            "García❓",
            "juan@test.com",
            "4421234567",
            "Calle 123",
            "",
            "",
            ""
        );

        expect(result.hasErrors).toBe(true);
        expect(result.errors.lastname2).toBe("Solo puedes ingresar letras mayúsculas y minúsculas.");
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

    test('Debe fallar con dirección muy corta', () => {
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

        expect(result.errors.address).toBe("La dirección es muy corta.");
    });

     test('Debe fallar con dirección menor a 2 caracteres', () => {
        const result = validateForm(
            "Juan",
            "Pérez",
            "",
            "juan@test.com",
            "4421234567",
            "     a",
            "",
            "",
            ""
        );

        expect(result.errors.address).toBe("La dirección es muy corta.");
    });


});