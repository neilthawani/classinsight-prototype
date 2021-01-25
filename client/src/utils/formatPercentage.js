export default function formatPercentage(decimalValue, precision, showValuesLessThanOne = true, appendPercentSign = true) {
     // * 1 is a hacky way to convert string to number
     var formattedValue = parseFloat(100 * decimalValue).toFixed(precision) * 1;

    if (appendPercentSign) {
        formattedValue += '%';
    }

    if (showValuesLessThanOne && decimalValue > 0 && decimalValue < 0.01 && precision === 0) {
        formattedValue = `<1${appendPercentSign ? '%' : ''}`
    }

    return formattedValue;
}
