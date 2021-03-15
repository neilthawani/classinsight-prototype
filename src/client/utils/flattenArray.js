var flattenArray = function(arr) {
  return [].concat.apply([], arr);
}

export default flattenArray;
