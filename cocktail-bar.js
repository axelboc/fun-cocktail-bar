
export const ALGORITHMS = {
  greedy: 0,
  dp: 1
}

export default class CocktailBar {
  
  constructor(budget, ingredients, cocktails) {
    this.budget = budget;
    this.cocktails = cocktails;
    this.ingrCosts = ingredients;
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
    
    let ingrValues, ingrRatios, solution;
    
    switch (algorithm) {
      case ALGORITHMS.greedy:
        ingrValues = this.computeIngrValues(ingrCocktails);
        ingrRatios = this.computeIngrRatios(this.ingrCosts, ingrValues);
        solution = this.solveGreedy(this.budget, this.ingrCosts, ingrRatios);
        break;
      case ALGORITHMS.dp:
        ingrValues = this.computeIngrValues(ingrCocktails);
        solution = this.solveDP(this.budget, this.ingrCosts, ingrValues);
        break;
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
   * @param {Map<String, Number>} values
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
   * Solve the problem with a Dynamic Programming algorithm.
   * @param {Number} budget
   * @param {Map<String, Number>} costs
   * @param {Map<String, Number>} ratios
   * @return {Object}
   *         {Array<String>} ingredients - the selected ingredients
   *         {Number} totalCost - their total cost
   */
  solveDP(budget, costs, values) {
    const costEntries = [...costs];
    
    // Initialise data matrices
    let barMatrix = [[]];
    let valueMatrix = [[]];
    for (let i = 0; i <= budget; i++) {
      barMatrix[0][i] = [];
      valueMatrix[0][i] = 0;
    }
    
    for (let j = 0, count = costEntries.length; j < count; j++) {
      const ingr = costEntries[j][0];
      const ingrCost = costEntries[j][1];
      
      barMatrix.push([]);
      valueMatrix.push([]);
      
      for (let costLimit = 0; costLimit <= budget; costLimit++) {
        const barWithoutIngr = barMatrix[j][costLimit];
        const valWithoutIngr = valueMatrix[j][costLimit];
        
        if (ingrCost > costLimit) {
          // Ingredient too expensive for current cost limit
          barMatrix[j + 1][costLimit] = barWithoutIngr;
          valueMatrix[j + 1][costLimit] = valWithoutIngr;
        } else {
          // Ingredient may be added
          // Compare the values with and without the ingredient, and keep the max
          const valWithIngr = valueMatrix[j][costLimit - ingrCost] + values.get(ingr);
          if (valWithIngr >= valWithoutIngr) {
            const barWithIngr = [...barMatrix[j][costLimit - ingrCost], ingr];
            barMatrix[j + 1][costLimit] = barWithIngr;
            valueMatrix[j + 1][costLimit] = valWithIngr;
          } else {
            barMatrix[j + 1][costLimit] = barWithoutIngr;
            valueMatrix[j + 1][costLimit] = valWithoutIngr;
          }
        }
      }
    }
    
    // Find final set and compute total cost
    const ingredients = barMatrix[costEntries.length][budget];
    return {
      ingredients: ingredients,
      totalCost: ingredients.reduce((total, ingr) => total + costs.get(ingr), 0)
    };
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
    ingrCocktails.forEach(function (list, ingr) {
      ingrValues.set(ingr, list.length);
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
    //console.log(...selectedIngredients);
    //console.log(...possibleCocktails);
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
  
  logMatrix(matrix) {
    matrix.forEach(function (row) {
      console.log(row.join('|'));
    })
  }
  
}
