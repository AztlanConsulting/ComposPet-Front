const formatCurrency = (value) => {
    const numericValue = Number(value) || 0;

    const formattedValue = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Math.abs(numericValue));

    return numericValue < 0
        ? `-$${formattedValue}`
        : `$${formattedValue}`;
};

export default formatCurrency;