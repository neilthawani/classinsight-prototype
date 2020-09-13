export default function(decimalValue, precision) {
    return `${parseFloat(100 * decimalValue).toFixed(precision)}%`;
}
