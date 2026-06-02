import InputComponent from '../molecules/InputComponent';
import Label from '../atoms/Label';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Modal from '../atoms/Modal';
import Form from 'react-bootstrap/Form';

import ColorPicker from '../molecules/ColorPicker';
import ImageUploader from '../atoms/ImageUploader';

import formatCurrency from '../../utilities/formatCurrency';

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

    const colors = [
        '#169B49',
        '#54B435',
        '#EF7100',
        '#F6B00B',
        '#4318FF',
        '#42A5E8',
        '#AD009E',
        '#D960C4',
        '#9D7BE0',
    ];

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
                    onChange={(e) => {
                        const value = e.target.value;
                        setName(value);
                        validateField('name', value);
                    }}
                    error={errors.name}
                    required
                >
                    Nombre <Icon name="requiredInput" size="mini" color="icon-required" />
                </InputComponent>

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
                        const value = e.target.value;
                        setDescription(value);
                        validateField('description', value);
                    }}
                />

                {errors.description && (
                    <p className="input-error-message">
                        {errors.description}
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
                        const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                        const parts = rawValue.split('.');

                        const cleanValue = parts.length > 2
                            ? `${parts[0]}.${parts.slice(1).join('')}`
                            : rawValue;

                        setPrice(cleanValue);
                        validateField('price', cleanValue);
                    }}
                    error={errors.price}
                    required
                >
                    Precio <Icon name="requiredInput" size="mini" color="icon-required" />
                </InputComponent>

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
                        setQuantity(value);
                        validateField('quantity', value);
                    }}
                    error={errors.quantity}
                    required
                >
                    Cantidad <Icon name="requiredInput" size="mini" color="icon-required" />
                </InputComponent>

                <div className="register-product-color-container" ref={colorRef}>
                    <Label id="product-color" size="lg" className="label">
                        Color <Icon name="requiredInput" size="mini" color="icon-required" />
                    </Label>

                    <ColorPicker
                        colors={colors}
                        selectedColor={color}
                        onSelectColor={(selectedColor) => {
                            setColor(selectedColor);
                            validateField('color', selectedColor);
                        }}
                    />

                    {errors.color && (
                        <p className="input-error-message">
                            {errors.color}
                        </p>
                    )}
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
                        <p className="input-error-message">
                            {errors.imageFile}
                        </p>
                    )}
                </div>

                <div className="buttons-container">
                    <Button
                        size="medium"
                        type="submit"
                        csstype="accept"
                        className="button"
                    >
                        Guardar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default RegisterProduct;