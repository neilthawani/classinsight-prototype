// Note: this is currently unused

export default function removeArrayValue(value, array, options) {
    var index = array.indexOf(value);

    if (index > -1) {
        array.splice(index, 1);
    }

    return array;
}
