var removePropertyFromObject = function(object, propKey) {
    const { [propKey]: propValue, ...rest } = object;
    return rest;
}

/*
let object = { a: 1, b: 2, c: 3 };
object = removePropertiesFromObject(object, 'a', 'b')
> result: { c: 3 }
*/
const removePropertiesFromObject = (object, ...keys) => Object.entries(object).reduce((prev, [key, value]) => ({...prev, ...(!keys.includes(key) && { [key]: value }) }), {})

export { removePropertyFromObject, removePropertiesFromObject }
