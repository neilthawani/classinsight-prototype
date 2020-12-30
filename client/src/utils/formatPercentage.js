export default function formatPercentage(decimalValue, precision, showValuesLessThanOne = true) {
    var formattedValue = `${parseFloat(100 * decimalValue).toFixed(precision)}%`;

    if (showValuesLessThanOne && decimalValue > 0 && decimalValue < 0.01 && precision === 0) {
        formattedValue = `<1%`
    }

    return formattedValue;
}
