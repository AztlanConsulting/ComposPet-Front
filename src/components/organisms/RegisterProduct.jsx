import InputComponent from '../molecules/InputComponent';
import Label from '../atoms/Label';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Modal from '../atoms/Modal';
import Form from 'react-bootstrap/Form';

import ColorPicker from '../molecules/ColorPicker';
import ImageUploader from '../atoms/ImageUploader';

import formatCurrency from '../../utilities/formatCurrency';
import ALLOWED_PRODUCT_COLORS from '../../utilities/productColors';

import '../../css/organisms/registerProductModal.css';
import '../../css/molecules/inputComponent.css';

function RegisterProduct({
    isOpen,
    onClose,
    viewModel,
}) {
    const {
        errors,

        name,
        setName,
        price,
        setPrice,
        quantity,
        setQuantity,
        color,
        setColor,
        description,
        setDescription,
        imageFile,

        nameRef,
        priceRef,
        quantityRef,
        colorRef,
        descriptionRef,
        imageFileRef,

        validateField,
        handleImageChange,
        handleSubmit,
        isPriceFocused,
        setIsPriceFocused,
    } = viewModel;

    const isFormInvalid =
    !name.trim() ||
    price === '' || price === null ||
    quantity === '' || quantity === null ||
    !ALLOWED_PRODUCT_COLORS.includes(color) ||
    errors.name ||
    errors.price ||
    errors.quantity ||
    errors.color ||
    errors.description ||
    errors.imageFile;

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="register-product-modal">
            <form
                onSubmit={handleSubmit}
                className="register-product-form"
                encType="multipart/form-data"
            >
                <h2 className="register-product-title">
                    Agregar producto
                </h2>

                <InputComponent
                    id="product-name"
                    type="text"
                    ref={nameRef}
                    value={name}
                    classNameLabel="label"
                    placeholder="Ej. Aserrín"
                    classNameInput={`register-input ${errors.name ? 'input-error' : ''}`}

                    onKeyDown={(e) => {
                        const allowed = /^[\p{L}\p{N}\s.()-]$/u;
                
                        if (
                            e.key.length === 1 &&
                            !allowed.test(e.key)
                        ) {
                            e.preventDefault();
                        }
                    }}

                    onChange={(e) => {
                        let value = e.target.value;
                    
                        value = value.replace(/[^\p{L}\p{N}\s.()\-]/gu, '');
                        value = value.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
                        value = value.slice(0, 60);
                    
                        setName(value);
                        validateField('name', value);
                    }}
                    error={errors.name}
                    required
                >
                    Nombre <Icon name="requiredInput" size="mini" color="icon-required" />
                </InputComponent>
                {!errors.name && (
                    <p className="helper-message">
                        {name.length}/60 caracteres
                    </p>
                )}

                <Label id="product-description" size="lg" className="label">
                    Descripción
                </Label>

                <Form.Control
                    as="textarea"
                    placeholder="Escribe la descripción del producto."
                    className="register-input-notes"
                    value={description}
                    maxLength={255}
                    onChange={(e) => {
                        let value = e.target.value;
                    
                        value = value.replace(/[^\p{L}\p{N}\s.,;:()\-]/gu, '');
                        value = value.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
                        value = value.replace(/^\s+/, '');
                        value = value.slice(0, 255);
                    
                        setDescription(value);
                        validateField('description', value);
                    }}
                />

                {errors.description && (
                    <p className="input-error-message">
                        {errors.description}
                    </p>
                )}
                
                {!errors.description && (
                    <p className="helper-message">
                        {description.length}/255 caracteres
                    </p>
                )}

                <InputComponent
                    id="product-price"
                    type="text"
                    ref={priceRef}
                    value={
                        isPriceFocused || !price
                            ? price
                            : formatCurrency(Number(price))
                    }
                    classNameLabel="label"
                    placeholder="Ej. 450.50"
                    classNameInput={`register-input ${errors.price ? 'input-error' : ''}`}
                    onFocus={() => setIsPriceFocused(true)}
                    onBlur={() => setIsPriceFocused(false)}
                    onChange={(e) => {
                        let value = e.target.value;
                    
                        value = value.replace(/[$,]/g, '');
                        value = value.replace(/[^0-9.]/g, '');
                    
                        const parts = value.split('.');
                    
                        if (parts.length > 2) {
                            value = `${parts[0]}.${parts.slice(1).join('')}`;
                        }
                    
                        const [integerPart, decimalPart] = value.split('.');
                    
                        if (decimalPart !== undefined) {
                            value = `${integerPart}.${decimalPart.slice(0, 2)}`;
                        }
                    
                        if (value !== '' && Number(value) > 100000) {
                            value = '100000';
                        }
                    
                        setPrice(value);
                        validateField('price', value);
                    }}
                    error={errors.price}
                    required
                >
                    Precio <Icon name="requiredInput" size="mini" color="icon-required" />
                </InputComponent>

                {!errors.price && (
                    <p className="helper-message">
                        Máximo permitido: $100,000.00
                    </p>
                )}

                <InputComponent
                    id="product-quantity"
                    type="text"
                    ref={quantityRef}
                    value={quantity}
                    classNameLabel="label"
                    placeholder="Ej. 10"
                    classNameInput={`register-input no-number-arrows ${errors.quantity ? 'input-error' : ''}`}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                    
                        if (Number(value) > 999) {
                            return;
                        }
                    
                        setQuantity(value);
                        validateField('quantity', value);
                    }}
                    error={errors.quantity}
                    required
                >
                    Cantidad <Icon name="requiredInput" size="mini" color="icon-required" />
                </InputComponent>

                {!errors.quantity && (
                    <p className="helper-message">
                        Máximo permitido: 999 unidades.
                    </p>
                )}

                <div className="register-product-color-container" ref={colorRef}>
                    <Label id="product-color" size="lg" className="label">
                        Color <Icon name="requiredInput" size="mini" color="icon-required" />
                    </Label>

                    <ColorPicker
                        colors={ALLOWED_PRODUCT_COLORS}
                        selectedColor={color}
                        onSelectColor={(selectedColor) => {
                            if (!ALLOWED_PRODUCT_COLORS.includes(selectedColor)) return;
                        
                            setColor(selectedColor);
                            validateField('color', selectedColor);
                        }}
                    /> 
                </div>

                <div className="register-product-image-container">
                    <Label id="product-image" size="lg" className="label">
                        Imagen
                    </Label>

                    <ImageUploader
                        ref={imageFileRef}
                        id="product-image"
                        selectedFile={imageFile}
                        onChange={handleImageChange}
                        error={errors.imageFile}
                    />

                    {errors.imageFile && (
                        <p className="error-message">
                            {errors.imageFile}
                        </p>
                    )}

                    {!errors.imageFile && (
                        <p className="helper-message">
                            Formatos permitidos: JPG, JPEG, SVG, AVIF, HEIC, PNG o WEBP.
                            <br />
                            Tamaño máximo: 2 MB.
                        </p> 
                    )}
                </div>

                <div className="buttons-container">
                    <Button
                        size="medium"
                        type="submit"
                        csstype="accept"
                        className="button"
                        disabled={Boolean(isFormInvalid)}
                    >
                        Guardar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default RegisterProduct;