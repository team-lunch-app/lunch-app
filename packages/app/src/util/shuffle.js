/**
 * Shuffles the given array. Modifies the original.
 * 
 * @param {any[]} array array to be shuffled
 * @returns the same array, shuffled
 */
export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
