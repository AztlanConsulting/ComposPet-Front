import React from 'react'
import "../../css/atoms/icon.css";

import { ReactComponent as PlusIcon } from '../../public/icons/plus.svg';
import { ReactComponent as MinusIcon } from '../../public/icons/minus.svg';
import { ReactComponent as ArrowIcon } from '../../public/icons/arrow.svg';
import { ReactComponent as BillsIcon } from '../../public/icons/bills.svg';
import { ReactComponent as CardIcon } from '../../public/icons/card-transfer.svg';
import { ReactComponent as CopyIcon } from '../../public/icons/copy.svg';
import { ReactComponent as FacebookIcon } from '../../public/icons/facebook.svg';
import { ReactComponent as GoogleIcon } from '../../public/icons/google.svg';
import { ReactComponent as InstagramIcon } from '../../public/icons/instagram.svg';
import { ReactComponent as LogoIcon } from '../../public/icons/logo.svg';
import { ReactComponent as PiggyIcon } from '../../public/icons/piggy.svg';
import { ReactComponent as SearchIcon } from '../../public/icons/search.svg';
import { ReactComponent as TiktokIcon } from '../../public/icons/tiktok.svg';
import { ReactComponent as EditIcon } from '../../public/icons/edit.svg';
import { ReactComponent as CancelIcon } from '../../public/icons/cancel.svg';
import { ReactComponent as SaveIcon } from '../../public/icons/save.svg';
import { ReactComponent as ReloadIcon } from '../../public/icons/reload.svg';
import { ReactComponent as GoogleSheetsIcon } from '../../public/icons/googlesheets.svg';
import { ReactComponent as EyeClosed } from '../../public/icons/eyeClosed.svg';
import { ReactComponent as OpenedEye } from '../../public/icons/eyeOpen.svg';
import { ReactComponent as RequiredInput } from '../../public/icons/required.svg';
import { ReactComponent as Family } from '../../public/icons/family.svg';
import { ReactComponent as Warning } from '../../public/icons/warning.svg';
import { ReactComponent as MoneyBag } from '../../public/icons/moneyBag.svg';
import { ReactComponent as Car } from '../../public/icons/car.svg';
import { ReactComponent as Money } from '../../public/icons/moneySign.svg';
import { ReactComponent as Trash } from '../../public/icons/trash.svg';
import { ReactComponent as CloseIcon } from '../../public/icons/x-lg.svg';
import { ReactComponent as UploadIcon } from '../../public/icons/upload.svg';

/**
 * Mapa de nombres de icono a sus componentes SVG correspondientes.
 * Permite la selección dinámica del icono mediante la prop `name`.
 *
 * @type {Object.<string, React.ComponentType>}
 */

const icons = {
    plus: PlusIcon,
    minus: MinusIcon,
    arrow: ArrowIcon,
    bills: BillsIcon,
    card: CardIcon,
    copy: CopyIcon,
    facebook: FacebookIcon,
    google: GoogleIcon,
    instagram: InstagramIcon,
    logo: LogoIcon,
    piggy: PiggyIcon,
    search: SearchIcon,
    tiktok: TiktokIcon,
    edit: EditIcon,
    cancel: CancelIcon,
    save: SaveIcon,
    reload: ReloadIcon,
    googleSheets: GoogleSheetsIcon,
    eyeClosed: EyeClosed,
    eyeOpened: OpenedEye,
    requiredInput : RequiredInput,
    family: Family,
    warning: Warning,
    moneyBag: MoneyBag,
    car: Car,
    moneySign: Money,
    trash: Trash,
    close: CloseIcon,
    upload: UploadIcon,
};

/**
 * Componente de icono SVG reutilizable con soporte opcional para interacción.
 * Si se proporciona `onClick`, el icono se renderiza dentro de un `<button>`
 * accesible. De lo contrario, se renderiza como SVG simple.
 *
 * @param {"small"|"medium"|"large"} [size="medium"] - Tamaño del icono.
 * @param {string} [name=""] - Clave del icono a renderizar. Debe coincidir con una entrada del mapa `icons`.
 * @param {string} [color=""] - Clase CSS para aplicar color al icono.
 * @param {string} [className=""] - Clases CSS adicionales.
 * @param {Function|null} [onClick=null] - Si se provee, envuelve el icono en un botón con este manejador de clic.
 * @param {string} [label=""] - Etiqueta accesible (`aria-label`) del botón. Requerida cuando se usa `onClick`.
 * @returns {JSX.Element|null} SVG del icono o botón con icono, o `null` si el nombre no es válido.
 */

export default function Icon({
    size = "",
    name = "",
    color = "",
    className = "",
    onClick = null,
    label = "",

}) {

    const IconComponent = icons[name];

    if(!IconComponent) return null;

    const svg = (
        <IconComponent
            className={`icon icon-${size} ${color} ${className}`}
            aria-hidden={!label}
        />   
    );

    if (onClick){
        return(
            <button
                className={`icon-button icon-button-${size} ${color} ${className}`}
                onClick={onClick}
                aria-label={label}
                type="button"
            >
                {svg}
            </button>
        );
    }

    return svg;
}
