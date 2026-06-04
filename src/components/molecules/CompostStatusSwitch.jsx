import Toggle from '../atoms/Toggle';
import '../../css/molecules/compostStatusSwitch.css';

/**
 * Componente que muestra un switch para controlar
 * el estatus de entrega de composta.
 *
 * Incluye una etiqueta descriptiva junto al componente Toggle.
 *
 * @param {string} id - Identificador único del switch.
 * @param {boolean} checked - Estado actual del switch.
 * @param {Function} onChange - Función ejecutada al cambiar el estado.
 * @param {string} label - Texto descriptivo mostrado junto al switch.
 * @param {string} [className=""] - Clase CSS adicional para estilos personalizados.
 * @param {string} [size="sm"] - Tamaño visual del switch.
 * @param {boolean} disabled - Indica si el switch está deshabilitado.
 *
 * @returns {JSX.Element} Componente visual del estatus de composta.
 */
export default function CompostStatusSwitch({ 
    id, 
    checked, 
    onChange, 
    label,
    className = "",
    size ="sm",
    disabled,
}) {

    return(
        <div className='compost-status-switch'>
            <span className='switch-label'>{label}</span>
            <Toggle 
                id={id}
                checked={checked}
                onChange={onChange}
                size= {size}
                className= {className}
                disabled={disabled}
            />
        </div>
    )
}