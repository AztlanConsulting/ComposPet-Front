const getProductImageUrl = (imagePath) => {
    if (!imagePath) return null;

    return `${process.env.REACT_APP_FILES_URL}/${imagePath}`;
};

export default getProductImageUrl;