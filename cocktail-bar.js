
export default class CocktailBar {
  
  constructor(budget, ingredients, cocktails) {
    this.budget = budget;
    this.cocktails = cocktails;
    this.ingrCosts = ingredients;
  }
  
  /**
   * Map each ingredient to the cocktails in which it is used.
   * @param {Map<String, Array<String>>} cocktails - the cocktails mapped to their ingredients
   * @return {Map<String, Array<String>>} - the ingredients mapped to their cocktails
   */
  mapIngrToCocktails(cocktails) {
    let ingrCocktails = new Map();
    
    cocktails.forEach(function (ingredients, cocktail) {
      ingredients.forEach(function (ingr) {
        let arr = ingrCocktails.get(ingr) || [];
        arr.push(cocktail);
        ingrCocktails.set(ingr, arr);
      });
    });
    
    return ingrCocktails;
  }
  
  /**
   * Compute the value of each ingredient.
   * @param {Map<String, Array<String>>} ingrCocktails - the ingredients mapped to their cocktails
   * @return {Map<String, Number>} - the ingredients mapped to their values
   */
  computeIngrValues(ingrCocktails) {
    // Compute the values
    let ingrValues = new Map();
    ingrCocktails.forEach(function (cocktails, ingr) {
      ingrValues.set(ingr, cocktails.length);
    });
    
    // Sort from highest to lowest and return
    return this.sortMapDesc(ingrValues);
  }
  
  /**
   * Compute the `value/cost` ratio of each ingredient.
   * @param {Map<String, Number>} costs - the ingredients mapped to their costs
   * @param {Map<String, Number>} values - the ingredients mapped to their values
   * @return {Map<String, Number>} - the ingredients mapped to their ratios
   */
  computeIngrRatios(costs, values) {
    // Compute ratio (iterate through `costs` map, as it is guaranteed to contain all ingredients)
    let ratios = new Map();
    costs.forEach(function (cost, ingr) {
      let val = values.get(ingr) || 0;
      ratios.set(ingr, val / cost);
    });
    
    // Sort from highest to lowest and return
    return this.sortMapDesc(ratios);
  }
  
  /**
   * Sort a map of numbers in descending order.
   * @param {Map<Any, Number>} map - the map to sort
   * @return {Map<Any, Number>} - the sorted map
   */
  sortMapDesc(map) {
    return new Map([...map].sort((a, b) => b[1] - a[1]));
  }
  
  /**
   * Solve the problem.
   * @param {String} algorithm - the algorithm to use
   * @return {Object}
   *         {Array<String>} ingredients - the selected ingredients
   *         {Number} totalCost - their total cost
   *         {Number} totalValue - their total value
   */
  solve(algorithm) {
    let ingrCocktails = this.mapIngrToCocktails(this.cocktails);
    let ingrValues = this.computeIngrValues(ingrCocktails);
    let ingrRatios = this.computeIngrRatios(this.ingrCosts, ingrValues);
    
    let solution;
    
    switch (algorithm) {
      case 'greedy':
        solution = this.solveGreedy(this.budget, this.ingrCosts, ingrRatios);
    }
    
    // Find possible cocktails and deduce total value
    solution.cocktails = this.findPossibleCocktails(this.cocktails, solution.ingredients);
    solution.totalValue = solution.cocktails.length;
    
    // Compute excluded ingredients and cocktails
    solution.excludedIngredients = this.computeDiff([...this.ingrCosts.keys()], solution.ingredients);
    solution.excludedCocktails = this.computeDiff([...this.cocktails.keys()], solution.cocktails);
    
    return solution;
  }
  
  /**
   * Solve the problem with a greedy approximation algorithm.
   * @param {Number} budget
   * @param {Map<String, Number>} costs
   * @param {Map<String, Number>} ratios
   * @return {Object}
   *         {Array<String>} ingredients - the selected ingredients
   *         {Number} totalCost - their total cost
   */
  solveGreedy(budget, costs, ratios) {
    let ingredients = [];
    let totalCost = 0;
    
    ratios.forEach(function (ratio, ingr) {
      let cost = costs.get(ingr);
      if (totalCost + cost <= budget) {
        ingredients.push(ingr);
        totalCost += cost;
      }
    });
    
    return {
      ingredients,
      totalCost
    };
  }
  
  /**
   * Find the cocktails that can be made with a specific set of ingredients.
   * @param {Map<String, Array<String>} allCocktails
   * @param {Array<String>} selectedIngredients
   * @return {Array<String>} - the possible cocktails
   */
  findPossibleCocktails(allCocktails, selectedIngredients) {
    const count = selectedIngredients.length;
    let possibleCocktails = [];
    
    allCocktails.forEach(function (ingredients, cocktail) {
      // Compute the union of the selected ingredients and the cocktail's ingredients
      let union = new Set(selectedIngredients.concat(ingredients));
      
      // If the new set has the same size as the set of selected ingredients,
      // it means that the cocktail doesn't contain any extra ingredients
      if (union.size === count) {
        possibleCocktails.push(cocktail);
      }
    });
    
    return possibleCocktails;
  }
  
  /**
   * Compute the difference between two arrays.
   * @param {Array<String>} arrA
   * @param {Array<String>} arrB
   * @return {Array<String>}
   */
  computeDiff(arrA, arrB) {
    let setB = new Set(arrB);
    return arrA.filter(item => !setB.has(item));
  }
  
}
