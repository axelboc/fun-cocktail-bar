# Cocktail Bar Optimiser
Given a **list of cocktails** and their ingredients, a **list of ingredients** and their cost, and a **budget** for purchasing a set of ingredients, compute the optimal set of ingredients that fits within the budget and allows for making the greatest variety of cocktails. This is a variant of the [Knapsack problem](https://en.wikipedia.org/wiki/Knapsack_problem): the weight of the items to be put in the knapsack is equivalent to the cost of the ingredients; the cost of the items to the number of cocktails in which each ingredient is used; and the weight limit of the knapsack to the budget for purchasing ingredients.

## Simplification of the problem
The problem does not take into consideration the volume of ingredients in each cocktail, and the relation between volume and cost of each ingredient.

The following ingredients have a cost that is considered to be negligeable and are therefore excluded from the list of ingredients of each cocktail:

- ice cubes
- salt, pepper, sugar, chillis, spices etc.
- mint leaves, olives and other garnishes
