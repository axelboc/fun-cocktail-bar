# Cocktail Bar Optimiser
Given a **list of cocktails** and their ingredients, a **list of ingredients** and their cost, and a **budget** for purchasing a set of ingredients, compute the optimal set of ingredients that fits within the budget and allows for making the greatest variety of cocktails.

## Knapsack problem
This is a variant of the [Knapsack problem](https://en.wikipedia.org/wiki/Knapsack_problem): the weight of the items to be put in the knapsack is equivalent to the cost of the ingredients; the sum of the items' costs (or *values*) that has to be maximised is equivalent to the number of cocktails that can be made with a specific set of ingredients; and the weight limit of the knapsack is the same as the budget for purchasing ingredients.

One subtle difference, is that ingredients do not have individual, summable values. The number of cocktails that can be made with a specific set of ingredients has to be re-calculated each time the set changes. This makes the implementation of the basic Knapsack greedy algorithm (based on a `value / weight` ratio for each item) non-trivial. The current implementation uses the number of cocktails in which each ingredient is used as the value for each ingredient, but as discussed, this is not a meaningful value. Perhaps the presence of an ingredient in a cocktail should not be worth a value of `1`, but of `1 / (total number of ingredients in the cocktail)`?

## Simplification of the problem
The problem does not take into consideration the volume of ingredients in each cocktail, and the relation between volume and cost of each ingredient.

The following ingredients have a cost that is considered to be negligeable and are therefore excluded from the list of ingredients of each cocktail:

- ice cubes
- salt, pepper, sugar, chillis, spices etc.
- mint leaves, olives and other garnishes
