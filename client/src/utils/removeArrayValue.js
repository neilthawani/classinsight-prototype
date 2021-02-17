export default function removeArrayValue(value, array, options) {
    // debugger;
    var index = array.indexOf(value);

    if (typeof value === "object") {
        index = array.findIndex(item => {
            // console.log("item", item, "value", value);
            // debugger;
            console.log("item.speakerType === value.speakerType && item.code === value.code", item.speakerType === value.speakerType && item.code === value.code);
            return item.speakerType === value.speakerType && item.code === value.code;
        });
    }

        console.log("index", index);

        // return array.filter((object) => {
        //       return
        // });
    //     return array.splice(index, 1);
    // } else {

        if (index > -1) {
            array.splice(index, 1);
        }

        return array;
    // }
}
