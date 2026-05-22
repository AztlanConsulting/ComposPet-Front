import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CopyLink from '../../../../components/molecules/CopyLink';

jest.mock('../../../../components/atoms/Icon', () => {
    return function MockIcon({ onClick }) {
        return (
            <button onClick={onClick}>
                copy
            </button>
        );
    };
});

jest.mock('../../../../components/atoms/CopyBubble', () => {
    return function MockCopyBubble({ bubbleMessage, type }) {
        return (
            <div data-testid="copy-bubble" data-type={type}>
                {bubbleMessage}
            </div>
        );
    };
});

describe('CopyLink', () => {
    beforeEach(() => {
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn(),
            },
        });
    });

    it('debe mostrar mensaje de éxito cuando copia correctamente', async () => {
        navigator.clipboard.writeText.mockResolvedValue();

        render(
            <CopyLink
                text="Formulario de recolección"
                link="https://compospetmx.org/inicio-sesion?redirect=/formulario-recoleccion"
                bubbleMessage="¡Copiado!"
            />
        );

        fireEvent.click(screen.getByText('copy'));

        await waitFor(() => {
            expect(screen.getByTestId('copy-bubble')).toHaveTextContent('¡Copiado!');
        });

        expect(screen.getByTestId('copy-bubble')).toHaveAttribute('data-type', 'success');
    });

    it('debe mostrar mensaje de error cuando falla el copiado', async () => {
        navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard error'));

        render(
            <CopyLink
                text="Formulario de recolección"
                link="https://www.compospetmx.org/inicio-sesion?redirect=/formulario-recoleccion"
                bubbleMessage="¡Copiado!"
            />
        );

        fireEvent.click(screen.getByText('copy'));

        await waitFor(() => {
            expect(screen.getByTestId('copy-bubble')).toHaveTextContent('¡No se pudo copiar!');
        });

        expect(screen.getByTestId('copy-bubble')).toHaveAttribute('data-type', 'error');
    });
});