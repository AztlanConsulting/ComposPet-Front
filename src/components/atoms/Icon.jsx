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
};

export default function Icon({
    size = "medium",    // small | medium | large
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
            className={`icon ${size} ${color} ${className}`}
            aria-hidden={!label}
        />   
    );

    if (onClick){
        return(
            <button
                className={`icon-button ${size} ${color} ${className}`}
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
