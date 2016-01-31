
export const ALGORITHMS = {
  greedy: 'greedy',
  dp: 'dynamic programming',
  bruteForce: 'brute force',
  customGreedy: 'custom greedy'
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
   *         {Array<String>} cocktails - the selected cocktails
   *         {Number} totalValue - the number of selected cocktails
   *         {Array<String>} excludedIngredients
   *         {Array<String>} excludedCocktails
   */
  solve(algorithm) {
    let ingrCocktails, ingrValues, ingrRatios;
    let cocktailCosts, cocktailValues, cocktailRatios;
    let solution;
    
    switch (algorithm) {
      case ALGORITHMS.greedy:
        ingrCocktails = this.mapIngrToCocktails(this.cocktails);
        ingrValues = this.computeIngrValues(ingrCocktails);
        ingrRatios = this.computeIngrRatios(this.ingrCosts, ingrValues);
        solution = this.solveGreedy(this.budget, this.ingrCosts, ingrRatios);
        break;
      case ALGORITHMS.dp:
        ingrCocktails = this.mapIngrToCocktails(this.cocktails);
        ingrValues = this.computeIngrValues(ingrCocktails);
        solution = this.solveDP(this.budget, this.ingrCosts, ingrValues);
        break;
      case ALGORITHMS.bruteForce:
        solution = this.solveBruteForce(this.budget, this.cocktails, this.ingrCosts);
        break;
      case ALGORITHMS.customGreedy:
        ingrCocktails = this.mapIngrToCocktails(this.cocktails);
        ingrValues = this.computeIngrValues(ingrCocktails);
        solution = this.solveCustomGreedy(this.budget, this.cocktails, this.ingrCosts, ingrValues);
        break;
    }
    
    // Find possible cocktails and deduce total value
    if (!solution.cocktails || !solution.totalValue) {
      solution.cocktails = this.findPossibleCocktails(this.cocktails, solution.ingredients);
      solution.totalValue = solution.cocktails.length;
    }
    
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
      ingredients: ingredients.sort(),
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
      ingredients: ingredients.sort(),
      totalCost: ingredients.reduce((total, ingr) => total + costs.get(ingr), 0)
    };
  }
  
  /**
   * Solve the problem with a brute force algorithm.
   * @param {Number} budget
   * @param {Map<String, Array<String>>} cocktails
   * @param {Map<String, Number>} costs
   * @return {Object}
   *         {Array<String>} ingredients - the selected ingredients
   *         {Number} totalCost - their total cost
   */
  solveBruteForce(budget, cocktails, costs) {
    const ingredients = [...costs.keys()];
    
    /**
     * Returns the best result of calling itself with and without selecting
     * the next ingredient in the list.
     * @param {Number} ingrIndex - index of the next ingredient in the `ingredients` array 
     * @param {Array<String>} currSelection - the current selection of ingredients
     * @param {Number} currCost - the total cost of the current selection
     * @return {Object}
     *         {Array<String>} ingredients - the selected ingredients
     *         {Number} totalCost - their total cost
     *         {Array<String>} cocktails - the selected cocktails
     *         {Number} totalValue - the number of selected cocktails
     */
    const findBestIngredients = function (ingrIndex, currSelection, currCost) {
      // Base case: no more ingredients
      if (ingrIndex >= ingredients.length) {
        // Compute and return the result for the current selection
        let possibleCocktails = this.findPossibleCocktails(cocktails, currSelection);
        return {
          ingredients: currSelection,
          totalCost: currCost,
          cocktails: possibleCocktails,
          totalValue: possibleCocktails.length
        };
      }

      const ingr = ingredients[ingrIndex];
      const ingrCost = costs.get(ingr); 
      let bestWithoutIngr, bestWithIngr;
      
      // Recurse without selecting the ingredient
      bestWithoutIngr = findBestIngredients(ingrIndex + 1, [...currSelection], currCost);
      
      // If selecting the ingredient does not go over budget, do so and recurse
      if (currCost + ingrCost <= budget) {
        bestWithIngr = findBestIngredients(ingrIndex + 1, [...currSelection, ingr], currCost + ingrCost);
      }
      
      // Return the best or only result
      // If the value is the same with and without the ingredient, return the result without
      if (bestWithIngr && bestWithIngr.totalValue > bestWithoutIngr.totalValue) {
        return bestWithIngr;
      } else {
        return bestWithoutIngr;
      }
    }.bind(this);
    
    // Call recursive function
    return findBestIngredients(0, [], 0);
  }
  
  /**
   * Solve the problem with a custom greedy algorithm.
   * @param {Number} budget
   * @param {Map<String, Array<String>>} cocktails
   * @param {Map<String, Number>} ingrCosts
   * @param {Map<String, Number>} ingrValues
   * @return {Object}
   *         {Array<String>} ingredients - the selected ingredients
   *         {Number} totalCost - their total cost
   */
  solveCustomGreedy(budget, cocktails, ingrCosts, ingrValues) {
    let totalCost = 0;
    let ingredients = [];
    
    // Make a copy of the cocktails map
    cocktails = new Map([...cocktails]);
    
    // Repeat until there's no cocktail left
    while (cocktails.size > 0) {
      // Compute the cost and ratio of each cocktail
      let { costs, ratios } = this.computeCocktailCVR(cocktails, ingrCosts, ingrValues);
      
      // Sort the cocktails by ratio and take the best entry
      let [cocktail, ratio] = this.sortMapDesc(ratios).entries().next().value;
      
      // If the cost of the best cocktail brings the total above the budget, remove it
      const cost = costs.get(cocktail);
      if (totalCost + cost > budget) {
        cocktails.delete(cocktail);
        continue;
      }
      
      // Otherwise, add the cocktail's ingredients to the list
      let newIngredients = cocktails.get(cocktail);
      ingredients.push(...newIngredients);
      
      // Add the cost to the total and remove the cocktail
      totalCost += cost;
      cocktails.delete(cocktail);
      
      // Remove the new ingredients from the remaining cocktails and update the cocktails' costs
      cocktails.forEach(function (list, c) {
        let set = new Set(list);
        newIngredients.forEach(function (ingr) {
          set.delete(ingr);
        });
        
        if (set.size === 0) {
          // If the cocktail has no remaining ingredients, remove it
          cocktails.delete(c);
        } else {
          // Otherwise, update its list of ingredients
          cocktails.set(c, [...set]);
        }
      });
    }
    
    return {
      ingredients: ingredients.sort(),
      totalCost
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
    let ratios = new Map();
    
    // Iterate through `costs` map, as it is guaranteed to contain all ingredients
    costs.forEach(function (cost, ingr) {
      let val = values.get(ingr) || 0;
      ratios.set(ingr, val / cost);
    });
    
    // Sort from highest to lowest and return
    return this.sortMapDesc(ratios);
  }
  
  /**
   * Compute the value, cost and ratio of each cocktail.
   * @param {Map<String, Array<String>} cocktails - the cocktails mapped to their ingredients
   * @param {Map<String, Number>} ingCosts - the ingredients mapped to their costs
   * @param {Map<String, Number>} ingrValues - the ingredients mapped to their values
   * @return {Object} - the cocktails mapped to their costs, values and ratios.
   *         {Map<String, Number>} costs
   *         {Map<String, Number>} values
   *         {Map<String, Number>} ratios
   */
  computeCocktailCVR(cocktails, ingrCosts, ingrValues) {
    let costs = new Map();
    let values = new Map();
    let ratios = new Map();

    cocktails.forEach(function (ingredients, cocktail) {
      const { cost, value } = ingredients.reduce(function (totals, ingr) {
        if (!ingrCosts.has(ingr)) {
          throw new Error(`Cost not found for ingredient: ${ingr}`);
        }
        
        return {
          cost: totals.cost + ingrCosts.get(ingr),
          value: totals.value + ingrValues.get(ingr)
        };
      }, { cost: 0, value: 0 });
      
      costs.set(cocktail, cost);
      values.set(cocktail, value);
      ratios.set(cocktail, value / cost);
    });
    
    return { costs, values, ratios };
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
