import React from 'react';
import FormCard from '../Template/formCard';
import YesNoQuestion from '../molecules/YesNoQuestion';
import CounterInput from '../molecules/counterInput';

import '../../css/organisms/firstFormRecolectionRequest.css';

/**
 * Organismo que agrupa todos los componentes de la primera sección del formulario de recolección
 * Utiliza un contenedor reutilizable y organiza las preguntas de sí y no
 * y los contadores en una cuadrícula responsiva
 *
 * @param {object} props - Props del organismo.
 * @param {boolean} props.quiereRecoleccion - Indica si el cliente desea recolección
 * @param {Function} props.setQuiereRecoleccion - Actualiza el estado de recolección
 * @param {boolean} props.quiereProductosExtra - Indica si el cliente desea productos extra
 * @param {Function} props.setQuiereProductosExtra - Actualiza el estado de productos extra
 * @param {number} props.cubetasEntregadas - Cantidad de cubetas vacías que se entregarán al cliente
 * @param {Function} props.setCubetasEntregadas - Actualiza la cantidad de cubetas entregadas
 * @param {number} props.cubetasRecolectadas - Cantidad de cubetas que se recolectarán del cliente
 * @param {Function} props.setCubetasRecolectadas - Actualiza la cantidad de cubetas recolectadas
 * @param {object} props.errors - Objeto de errores del formulario.
 * @returns {JSX.Element}
 */
export default function FirstFormRecolectionRequest({
    quiereRecoleccion,
    setQuiereRecoleccion,
    quiereProductosExtra,
    setQuiereProductosExtra,
    cubetasEntregadas,
    setCubetasEntregadas,
    cubetasRecolectadas,
    setCubetasRecolectadas,
    errors,
}) {
    return (
        <FormCard>
            <div className="first-form-recolection-request-grid">
                <YesNoQuestion
                    id="quiere-recoleccion"
                    question="¿Quieres recolección?"
                    value={quiereRecoleccion}
                    onChange={setQuiereRecoleccion}
                    error={errors.quiereRecoleccion}
                />

                <CounterInput
                    question="¿Cuántas cubetas vacías quieres?"
                    value={cubetasEntregadas}
                    onIncrement={() => setCubetasEntregadas((prev) => prev + 1)}
                    onDecrement={() => setCubetasEntregadas((prev) => Math.max(0, prev - 1))}
                    error={errors.cubetasEntregadas}
                />

                <YesNoQuestion
                    id="quiere-productos-extra"
                    question="¿Quieres productos extra?"
                    value={quiereProductosExtra}
                    onChange={setQuiereProductosExtra}
                    error={errors.quiereProductosExtra}
                />

                <CounterInput
                    question="¿Cuántas cubetas vas a entregar?"
                    value={cubetasRecolectadas}
                    onIncrement={() => setCubetasRecolectadas((prev) => prev + 1)}
                    onDecrement={() => setCubetasRecolectadas((prev) => Math.max(0, prev - 1))}
                    error={errors.cubetasRecolectadas}
                />
            </div>
        </FormCard>
    );
}