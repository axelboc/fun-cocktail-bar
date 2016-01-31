import Promise from 'bluebird';
import nodeFS from 'fs';
const fs = Promise.promisifyAll(nodeFS);


// Export the entry point
export default { get };


/**
 * Return a promise that resolves with the ingredients and cocktails data
 * for the given dataset.
 * @param {String} dataset
 * @return {Promise} - resolving to...
 *         {Map<String, Number} - the ingredients mapped to their cost
 *         {Map<String, Array>} - the cocktails mapped to their ingredients
 */
function get(dataset) {
  const path = `data/${dataset}`;
  return Promise.all([readIngredients(path), readCocktails(path)]);
}

/**
 * Read ingredients data.
 * @param {String} path - relative path to folder containing datasets
 * @return {Promise} - resolving to...
 *         {Map<String, Number} - the ingredients mapped to their cost
 */
function readIngredients(path) {
  return fs.readFileAsync(`${path}/ingredients.txt`, 'utf8')
    .then(parseContent)
    .then(function (items) {
      items.forEach((val, key) => items.set(key, Number.parseInt(val, 10)));
      return items;
    });
}

/**
 * Read cocktails data.
 * @param {String} path - relative path to folder containing datasets
 * @return {Promise} - resolving to...
 *         {Map<String, Array>} - the cocktails mapped to their ingredients
 */
function readCocktails(path) {
  return fs.readFileAsync(`${path}/cocktails.txt`, 'utf8')
    .then(parseContent)
    .then(function (items) {
      items.forEach((val, key) => items.set(key, val.split(',')));
      return items;
    });
}

/**
 * Parse the content of a data file.
 * @param {String} content
 * @return {Map<String, String>}
 */
function parseContent(content) {
  return new Map(content.replace(/ {2,}/gm, '\t').split('\r\n').map(line => line.split('\t')));
}
