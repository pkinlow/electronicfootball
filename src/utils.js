/**
 * Gets Random Integer
 * @param {number} min - Min integer
 * @param {number} max - Max integer
 * @return {*} - Returns a random number between min and max integer
 */
export function getRandomInt(min, max) {
  if (arguments.length === 1) {
    max = min;
    min = 0;
  }

  // Sets Defaults
  min = min || 0;
  max = max || min + 1;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gets Random Item From An Array
 * @param {array} list - Array of Items
 * @param {number} startIndex - Starting Index Of Array
 * @param {number} endIndex - Ending Index Of Array.
 * @return {*} - Returns array item based on the randomlly selected index
 */
export function getRandomItem(list, startIndex, endIndex) {
  var min = startIndex || 0;
  var max = endIndex || list.length - 1;
  var randomIndex = getRandomInt(min, max);
  return list[randomIndex];
}

/**
 * Shuffle An Array Of Items
 * @param {array} list - Array of Items
 * @return {array} - Returns new array of randomized items
 */
export function shuffle(listOfItems) {
  var list = listOfItems.slice();
  return list.slice().reduce(function(bag) {
    // var randomIndex = Math.floor(Math.random() * ((list.length-1) - 0 + 1)) + 0;
    return bag.concat(list.splice(getRandomItem(list),1));
  }, []);
}

export default { getRandomInt, getRandomItem, shuffle };
