const getProductImageUrl = (imagePath) => {
    if (!imagePath) {
        return `${process.env.REACT_APP_FILES_URL}/uploads/products/default-product.jpg`;
    }

    return `${process.env.REACT_APP_FILES_URL}/${imagePath}`;
};

export default getProductImageUrl;