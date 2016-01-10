
export default class CocktailBar {
  
  constructor(budget, ingredients, cocktails) {
    this.budget = budget;
    this.ingredients = ingredients;
    this.cocktails = cocktails;
    
    // Map each ingredient to the cocktails in which it is used
    this.ingrToCocktails = new Map();
    this.cocktails.forEach(function (ingrList, cocktail) {
      ingrList.forEach(function (ingr) {
        let list = this.ingrToCocktails.get(ingr) || new Set();
        list.add(cocktail);
        this.ingrToCocktails.set(ingr, list);
      }, this);
    }, this);
    
    // Count the cocktails for each ingredient
    this.ingrToCocktailsCount = new Map();
    this.ingrToCocktails.forEach(function (list, ingr) {
      this.ingrToCocktailsCount.set(ingr, list.size);
    }, this);
    
    // Sort from highest to lowest
    this.ingrToCocktailsCount = new Map([...this.ingrToCocktailsCount].sort((a, b) => b[1] - a[1]));
    console.log(...this.ingrToCocktailsCount);
  }
  
}
