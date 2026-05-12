import React from 'react';
import "../../css/atoms/copyBubble.css";

export default function CopyBubble({
    copyMessage = '',
}) {
    return (
        <div className="copy-bubble">
            {copyMessage}
        </div>
    );
}