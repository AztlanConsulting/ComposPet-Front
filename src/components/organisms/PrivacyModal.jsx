import Modal from 'react-bootstrap/Modal';
import Button from '../atoms/Button';

/**
 * Modal que muestra el aviso de privacidad de la aplicación.
 * El modal puede cerrarse mediante el botón "Cerrar" o el ícono de cierre del encabezado.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.show - Controla la visibilidad del modal.
 * @param {Function} props.onHide - Función que se ejecuta al cerrar el modal.
 * @returns {JSX.Element} Modal con el contenido del aviso de privacidad.
 */
function PrivacyModal({ show, onHide }) {
    return (
        <Modal show={show} onHide={onHide} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Aviso de Privacidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Contenido...</p>
            </Modal.Body>
            <Modal.Footer>
                <Button size="medium" csstype="cancel" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PrivacyModal;