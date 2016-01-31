// Dependencies
import 'babel-polyfill';
import dataset from './dataset';
import CocktailBar, { ALGORITHMS } from './cocktail-bar';


// Config
const DATASET = '2';
const BUDGET = 200;
const ALGO = ALGORITHMS.customGreedy;


// Read initial data
dataset
  .get(DATASET)
  .then(function (data) {
    // Initialise the cocktail bar
    let cocktailBar = new CocktailBar(BUDGET, ...data);
    
    // Solve the problem
    let solution = cocktailBar.solve(ALGO);
    
    // Print the result
    console.log("Algorithm:", ALGO);
    console.log("Total cost:", solution.totalCost);
    console.log("Ingredients count:", solution.ingredients.length, "out of", data[0].size);
    console.log("Ingredients:", solution.ingredients.join(', '));
    console.log("Cocktails count:", solution.totalValue, "out of", data[1].size);
    console.log("Cocktails:", solution.cocktails.join(', '));
    //console.log("Excluded ingredients:", solution.excludedIngredients.join(', '));
    //console.log("Excluded cocktails:", solution.excludedCocktails.join(', '));
  });
