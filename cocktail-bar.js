
export default class CocktailBar {
  
  constructor(budget, ingredients, cocktails) {
    this.budget = budget;
    this.cocktails = cocktails;
    this.ingrCosts = ingredients;
    this.ingrValues = this.computeIngrValues(cocktails);
  }
  
  /**
   * Determine the value of each ingredient
   * (i.e. the number of cocktails in which it is used).
   * @param {Map<String, Array>} cocktailsIngredients - the cocktails mapped to their ingredients
   * @return {Map<String, Number>} - the ingredients mapped to their values
   */
  computeIngrValues(cocktailsIngredients) {
    // Map each ingredient to the cocktails in which it is used
    var ingrCocktails = new Map();
    cocktailsIngredients.forEach(function (ingredients, cocktail) {
      ingredients.forEach(function (ingr) {
        // Use a set to store the cocktails and ensure uniqueness
        let list = ingrCocktails.get(ingr) || new Set();
        list.add(cocktail);
        ingrCocktails.set(ingr, list);
      });
    });
    
    // Compute the values
    var values = new Map();
    ingrCocktails.forEach(function (cocktails, ingr) {
      values.set(ingr, cocktails.size);
    });
    
    // Sort from highest to lowest and return
    return new Map([...values].sort((a, b) => b[1] - a[1]));
  }
  
}
