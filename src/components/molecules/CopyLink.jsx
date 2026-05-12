import React, { useState } from 'react';
import Icon from "../atoms/Icon";
import CopyBubble from "../atoms/CopyBubble";

import "../../css/atoms/icon.css";
import "../../css/molecules/copyLink.css";

export default function CopyLink({
    link = '',
    text = '',
    copyMessage = '',
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    return (
        <div className="icon-button">
            <span className="copy-link-text">{text}</span>

            <div className="copy-icon-wrapper">
                {copied && <CopyBubble copyMessage={copyMessage} />}

                <Icon
                    className="icon-primary"
                    name="copy"
                    size="small"
                    color="secondary"
                    onClick={handleCopy}
                />
            </div>
        </div>
    );
}