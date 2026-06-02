import React, { forwardRef } from 'react';
import Icon from './Icon';
import '../../css/atoms/imageUploader.css';

const ImageUploader = forwardRef(({
    id = 'product-image',
    selectedFile = null,
    onChange = () => {},
    error = '',
}, ref) => {
    return (
        <label htmlFor={id} className={`image-uploader ${error ? 'error' : ''}`}>
            <input
                ref={ref}
                id={id}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={onChange}
                className="image-uploader-input"
            />

            <Icon name="arrow" size="large" className="image-uploader-icon" />

            {selectedFile && (
                <span className="image-uploader-file-name">
                    {selectedFile.name}
                </span>
            )}
        </label>
    );
});

export default ImageUploader;