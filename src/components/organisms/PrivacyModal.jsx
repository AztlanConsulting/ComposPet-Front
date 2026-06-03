import Modal from 'react-bootstrap/Modal';
import Button from '../atoms/Button';

const privacyContent = (
    <>
        <p>
            <strong>Última actualización:</strong> 1 de junio de 2026
        </p>

        <h5>1. Responsable del tratamiento de datos</h5>
        <p>
            Este sitio web es operado por <strong> ComposPet </strong>,
            quien es responsable del tratamiento y protección de los datos personales
            proporcionados por los usuarios a través de la plataforma.
        </p>

        <p>
            Para cualquier consulta relacionada con la privacidad y el tratamiento de
            datos personales, puede contactarnos en:
            <br />
            <strong>Correo electrónico:</strong> compospet.qro@gmail.com
        </p>

        <h5>2. Datos personales que recopilamos</h5>
        <p>Podemos recopilar y procesar los siguientes datos personales:</p>

        <ul>
            <li>Nombre completo.</li>
            <li>Dirección de correo electrónico.</li>
            <li>Número telefónico.</li>
            <li>Dirección postal.</li>
            <li>Información familiar proporcionada por el usuario.</li>
            <li>Información bancaria o financiera necesaria para la prestación de nuestros servicios.</li>
            <li>Información proporcionada voluntariamente mediante formularios o comunicaciones con nuestro equipo.</li>
        </ul>

        <h5>3. Finalidad del tratamiento</h5>
        <p>Los datos personales recopilados podrán ser utilizados para:</p>

        <ul>
            <li>Crear y administrar cuentas de usuario.</li>
            <li>Proporcionar los servicios ofrecidos por la plataforma.</li>
            <li>Gestionar solicitudes, contratos o trámites relacionados con nuestros servicios.</li>
            <li>Comunicarnos con los usuarios respecto a sus solicitudes o servicios contratados.</li>
            <li>Realizar validaciones de identidad cuando sea necesario.</li>
            <li>Cumplir obligaciones legales y regulatorias aplicables.</li>
        </ul>

        <p>
            No utilizaremos los datos personales para finalidades distintas a las
            descritas sin obtener el consentimiento correspondiente cuando sea requerido
            por la ley.
        </p>

        <h5>4. Compartición de información</h5>
        <p>Los datos personales podrán ser compartidos únicamente en los siguientes casos:</p>

        <ul>
            <li>Con proveedores tecnológicos necesarios para el funcionamiento de la plataforma.</li>
            <li>Cuando sea requerido por autoridades competentes conforme a la legislación aplicable.</li>
            <li>Cuando el usuario otorgue su consentimiento expreso.</li>
        </ul>

        <p>
            No vendemos ni comercializamos datos personales de nuestros usuarios.
        </p>

        <h5>5. Seguridad de la información</h5>
        <p>
            Implementamos medidas administrativas, técnicas y organizativas razonables
            para proteger la información personal contra accesos no autorizados,
            pérdida, alteración o divulgación indebida.
        </p>

        <p>
            Sin embargo, ningún sistema de transmisión o almacenamiento electrónico
            puede garantizar seguridad absoluta.
        </p>

        <h5>6. Derechos de los usuarios</h5>
        <p>Los usuarios podrán solicitar:</p>

        <ul>
            <li>Acceso a sus datos personales.</li>
            <li>Corrección de información incorrecta o desactualizada.</li>
            <li>Cancelación de sus datos cuando sea legalmente procedente.</li>
            <li>Oposición al tratamiento de sus datos.</li>
        </ul>

        <p>
            Las solicitudes podrán realizarse mediante el correo electrónico de contacto
            indicado en este aviso.
        </p>

        <h5>7. Servicios de terceros</h5>
        <p>
            Nuestra plataforma puede utilizar servicios de terceros, incluyendo
            herramientas proporcionadas por Google, para la autenticación de usuarios,
            análisis de uso o integración con otros servicios.
        </p>

        <p>
            Estos proveedores pueden procesar información conforme a sus propias
            políticas de privacidad.
        </p>

        <h5>8. Cambios al aviso de privacidad</h5>
        <p>
            Este aviso podrá ser actualizado periódicamente para reflejar cambios en
            nuestras prácticas de tratamiento de datos o en los requisitos legales
            aplicables.
        </p>

        <p>
            La versión vigente estará disponible en esta página.
        </p>

        <h5>Contacto</h5>
        <p>
            Para cualquier duda relacionada con este Aviso de Privacidad, puede escribir a:
            <br />
            <strong>compospet.qro@gmail.com</strong>
        </p>
    </>
);

/**
 * Modal que muestra el aviso de privacidad de la aplicación.
 * El modal puede cerrarse mediante el botón "Cerrar" o el ícono de cierre del encabezado.
 *
 * @param {Object} props
 * @param {boolean} props.show - Controla la visibilidad del modal.
 * @param {Function} props.onHide - Función que se ejecuta al cerrar el modal.
 * @returns {JSX.Element}
 */
function PrivacyModal({ show, onHide }) {
    return (
        <Modal show={show} onHide={onHide} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Aviso de Privacidad</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {privacyContent}
            </Modal.Body>

            <Modal.Footer>
                <Button
                    size="medium"
                    csstype="cancel"
                    onClick={onHide}
                >
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PrivacyModal;