var removePropertyFromObject = function(object, propKey) {
    const { [propKey]: propValue, ...rest } = object;
    // console.log("propValue", propValue);
    // console.log("rest", rest);
    return rest;
    // object = rest;
    // return object;
}

/*
let object = { a: 1, b: 2, c: 3 };
object = removePropertiesFromObject(object, 'a', 'b')
> result: { c: 3 }
*/
const removePropertiesFromObject = (object, ...keys) => Object.entries(object).reduce((prev, [key, value]) => ({...prev, ...(!keys.includes(key) && { [key]: value }) }), {})

export { removePropertyFromObject, removePropertiesFromObject }
