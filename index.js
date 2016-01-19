// Dependencies
import 'babel-polyfill';
import Promise from 'bluebird';
import nodeFS from 'fs';
const fs = Promise.promisifyAll(nodeFS);
import CocktailBar, { ALGORITHMS } from './cocktail-bar';


// Config
const BUDGET = 100;


// Read initial data
Promise.all([readIngredients(), readCocktails()])
  .then(function (data) {
    // Initialise the cocktail bar
    let cocktailBar = new CocktailBar(BUDGET, ...data);
    
    // Solve the problem
    let solution = cocktailBar.solve(ALGORITHMS.greedy);
    
    // Print the result
    console.log("Total cost:", solution.totalCost);
    console.log("Ingredients count:", solution.ingredients.length, "out of", data[0].size);
    console.log("Ingredients:", solution.ingredients.join(', '));
    console.log("Excluded ingredients:", solution.excludedIngredients.join(', '));
    console.log("Cocktails count:", solution.totalValue, "out of", data[1].size);
    console.log("Cocktails:", solution.cocktails.join(', '));
    console.log("Excluded cocktails:", solution.excludedCocktails.join(', '));
  })


/**
 * Read ingredients data.
 * @return {Promise} - resolving to...
 *         {Map<String, Number} - the ingredients mapped to their cost
 */
function readIngredients() {
  return fs.readFileAsync('data/ingredients.txt', 'utf8')
    .then(parseContent)
    .then(function (items) {
      items.forEach((val, key) => items.set(key, Number.parseInt(val, 10)));
      return items;
    });
}

/**
 * Read ingredients data.
 * @return {Promise} - resolving to...
 *         {Map<String, Array>} - the cocktails mapped to their ingredients
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
