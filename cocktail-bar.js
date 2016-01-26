
export const ALGORITHMS = {
  greedy: 'greedy',
  dp: 'dynamic programming',
  customGreedy: 'custom greedy',
  bruteForce: 'brute force'
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
      case ALGORITHMS.customGreedy:
        solution = this.solveCustomGreedy(this.budget, this.cocktails, this.ingrCosts);
        break;
      case ALGORITHMS.bruteForce:
        solution = this.solveBruteForce(this.budget, this.cocktails, this.ingrCosts);
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
   * Solve the problem with a custom greedy algorithm.
   * @param {Number} budget
   * @param {Map<String, Array<String>>} cocktails
   * @param {Map<String, Number>} costs
   * @return {Object}
   *         {Array<String>} ingredients - the selected ingredients
   *         {Number} totalCost - their total cost
   */
  solveCustomGreedy(budget, cocktails, costs) {
    let totalCost = 0;
    let ingredients = [];
    
    // Make a copy of the cocktails map
    cocktails = new Map([...cocktails]);
    
    // Compute the total cost of each cocktail's ingredients
    let cocktailCosts = new Map();
    cocktails.forEach(function (list, cocktail) {
      cocktailCosts.set(cocktail, list.reduce((total, ingr) => total + costs.get(ingr), 0));
    })
    
    // Repeat until there's no cocktail left (or the budget has been reached)
    while (cocktails.size > 0) {
      // Find the cheapest cocktail
      let min, cheapest;
      cocktailCosts.forEach(function (cost, cocktail) {
        if (!min || cost < min) {
          min = cost;
          cheapest = cocktail;
        }
      })
      
      // If the min cost brings the total above the budget, stop here
      if (totalCost + min > budget) {
        break;
      }
      
      // Otherwise, add the cocktail's ingredients to the list
      let newIngredients = cocktails.get(cheapest);
      ingredients.push(...newIngredients);
      totalCost += min;
      
      // Then, remove the new ingredients from the remaining cocktails and update the cocktails' costs
      cocktails.forEach(function (list, cocktail) {
        let set = new Set(list);
        newIngredients.forEach(function (ingr) {
          if (set.has(ingr)) {
            set.delete(ingr);
            cocktailCosts.set(cocktail, cocktailCosts.get(cocktail) - costs.get(ingr));
          }
        });
        
        if (set.size === 0) {
          // If the cocktail has no remaining ingredients, remove it
          cocktails.delete(cocktail);
          cocktailCosts.delete(cocktail);
        } else {
          // Otherwise, update its list of ingredients
          cocktails.set(cocktail, [...set]);
        }
      });
    }
    
    return {
      ingredients: ingredients.sort(),
      totalCost
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
