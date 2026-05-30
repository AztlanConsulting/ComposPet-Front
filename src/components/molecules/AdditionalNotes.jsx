import "../../css/molecules/additionalNotes.css"
import FormCard from "../Template/formCard";
import InputComponent from "./InputComponent";

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
        <div className={`notes-card ${className}`}>
            <Form.Control
                as="textarea"
                placeholder="Escribe cualquier nota adicional..."
                className="input-notes"
                value={notes}
                onChange={(event) => {
                    setNotes(event.target.value);
                }}
            />
        </div>
    );
}