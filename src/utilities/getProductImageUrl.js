const getProductImageUrl = (imagePath) => {
    const filesUrl =
        process.env.REACT_APP_FILES_URL || window.location.origin;

    if (!imagePath) {
        return `${filesUrl}/uploads/products/default-product.jpg`;
    }

    const normalizedPath = imagePath.startsWith("/")
        ? imagePath
        : `/${imagePath}`;

    return `${filesUrl}${normalizedPath}`;
};

export default getProductImageUrl;