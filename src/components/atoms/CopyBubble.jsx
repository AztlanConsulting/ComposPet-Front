import React from 'react';
import "../../css/atoms/copyBubble.css";

export default function CopyBubble({
    bubbleMessage = '',
}) {
    return (
        <div className="copy-bubble">
            {bubbleMessage}
        </div>
    );
}