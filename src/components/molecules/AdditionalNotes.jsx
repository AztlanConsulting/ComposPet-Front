import "../../css/molecules/additionalNotes.css"
import FormCard from "../Template/formCard";
import InputComponent from "./InputComponent";

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
/**
 * Tarjeta con input para añadir notas a la recolección.
 *
 * @returns {JSX.Element} Tarjeta con input.
 */
export default function AdditionalNotes({
    notes,
    setNotes,
    className = "",
}) {
    return (
            <FormCard className={`
                notes-card
                paddings
                ${className}
            `}
            >
                <strong>
                    Notas adicionales.
                </strong>

        <br />
        <Form.Control
            as="textarea"
            placeholder="Escribe cualquier nota adicional que los operadores necesiten para poder entregar tus productos."
            className="input-notes"
        />


            </FormCard>
    );
}   