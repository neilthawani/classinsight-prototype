export default function removeArrayValue(value, array, options) {
    var index = array.indexOf(value);

    if (typeof value === "object") {
        index = array.findIndex(item => {
            return item.speakerType === value.speakerType && item.code === value.code;
        });
    }

    if (index > -1) {
        array.splice(index, 1);
    }

    return array;
}
