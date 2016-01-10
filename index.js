// Dependencies
import Promise from 'bluebird';
import nodeFS from 'fs';
const fs = Promise.promisifyAll(nodeFS);
import CocktailBar from './cocktail-bar';


// Config
const BUDGET = 200;


// Read initial data
Promise.all([readIngredients(), readCocktails()])
  .then(function (data) {
    let cocktailBar = new CocktailBar(BUDGET, ...data);
  })


/**
 * Read ingredients data.
 * @return {Promise}
 */
function readIngredients() {
  return fs.readFileAsync('data/ingredients.txt', 'utf8')
    .then(parseContent);
}

/**
 * Read ingredients data.
 * @return {Promise}
 */
function readCocktails() {
  return fs.readFileAsync('data/cocktails.txt', 'utf8')
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
