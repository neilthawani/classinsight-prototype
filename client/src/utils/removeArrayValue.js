export default function(value, array) {
    var index = array.indexOf(value);

    if (index > -1) {
        array.splice(index, 1);
    }

    return array;
}
