import Toggle from '../atoms/Toggle';
import '../../css/molecules/compostStatusSwitch.css';

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