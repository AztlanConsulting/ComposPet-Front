import React from 'react';
import FormCard from '../Template/formCard';
import YesNoQuestion from '../molecules/YesNoQuestion';
import CounterInput from '../molecules/counterInput';

import '../../css/organisms/firstFormRecolectionRequest.css';

/**
 * Organismo que agrupa todos los componentes de la primera sección del formulario de recolección.
 * Utiliza un contenedor reutilizable y organiza las preguntas de sí y no
 * y los contadores en una cuadrícula responsiva.
 *
 * @param {Object} props - Props del organismo.
 * @param {boolean} props.wantsCollection - Indica si el cliente desea recolección.
 * @param {Function} props.setWantsCollection - Actualiza el estado de recolección.
 * @param {boolean} props.wantsExtraProducts - Indica si el cliente desea productos extra.
 * @param {Function} props.setWantsExtraProducts - Actualiza el estado de productos extra.
 * @param {number} props.deliveredBuckets - Cantidad de cubetas vacías que se entregarán al cliente.
 * @param {Function} props.setDeliveredBuckets - Actualiza la cantidad de cubetas entregadas.
 * @param {number} props.collectedBuckets - Cantidad de cubetas que se recolectarán del cliente.
 * @param {Function} props.setCollectedBuckets - Actualiza la cantidad de cubetas recolectadas.
 * @param {Object} props.errors - Objeto de errores del formulario.
 * @returns {JSX.Element} Primera sección del formulario de recolección.
 */
export default function FirstFormCollectionRequest({
    wantsCollection,
    setWantsCollection,
    wantsExtraProducts,
    setWantsExtraProducts,
    deliveredBuckets,
    setDeliveredBuckets,
    collectedBuckets,
    setCollectedBuckets,
    errors,
}) {
    return (
        <FormCard>
            <div className="first-form-collection-request-grid">
                <div className="first-form-collection-request-collection">
                    <YesNoQuestion
                        id="wants-collection"
                        question="¿Te anotamos para recolección de esta semana?"
                        value={wantsCollection}
                        onChange={setWantsCollection}
                        error={errors.wantsCollection}
                    />
                </div>

                <div className="first-form-collection-request-delivered-buckets">
                    <CounterInput
                        question="¿Cuántas cubetas necesitas?"
                        value={deliveredBuckets}
                        onIncrement={() => setDeliveredBuckets((previousValue) => previousValue + 1)}
                        onDecrement={() => setDeliveredBuckets((previousValue) => Math.max(0, previousValue - 1))}
                        error={errors.deliveredBuckets}
                    />
                </div>

                <div className="first-form-collection-request-extra-products">
                    <YesNoQuestion
                        id="wants-extra-products"
                        question="¿Quieres productos extra?"
                        value={wantsExtraProducts}
                        onChange={setWantsExtraProducts}
                        error={errors.wantsExtraProducts}
                    />
                </div>

                <div className="first-form-collection-request-collected-buckets">
                    <CounterInput
                        question="¿Cuántas cubetas vas a entregar?"
                        value={collectedBuckets}
                        onIncrement={() => setCollectedBuckets((previousValue) => previousValue + 1)}
                        onDecrement={() => setCollectedBuckets((previousValue) => Math.max(0, previousValue - 1))}
                        error={errors.collectedBuckets}
                    />
                </div>
            </div>
        </FormCard>
    );
}