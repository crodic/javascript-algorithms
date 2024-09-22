export function formatCurrency(number) {
    const formattedNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedCurrency = `${formattedNumber} VNĐ`;
    return formattedCurrency;
}
