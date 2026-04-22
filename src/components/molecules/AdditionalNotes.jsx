import "../../css/molecules/additionalNotes.css"
import FormCard from "../Template/formCard";
import InputComponent from "./InputComponent";

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

            <InputComponent
                id="nombre"
                type="textarea"
                size="md"
                placeholder="Escribe cualquier nota adicional que los operadores necesiten para poder entregar tus productos."
                classNameLabel="label"
                classNameInput="input-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
            >
            </InputComponent>


            </FormCard>
    );
}   