# Cocktail Bar Optimiser
Given a **list of cocktails** and their ingredients, a **list of ingredients** and their cost, and a **budget** for purchasing a set of ingredients, compute the optimal set of ingredients that fits within the budget and allows for making the greatest variety of cocktails.

## Simplification of the problem
The problem does not take into consideration the volume of ingredients in each cocktail, and the relation between volume and cost of each ingredient.

The following ingredients have a cost that is considered to be negligeable and are therefore excluded from the list of ingredients of each cocktail:

- ice cubes
- salt, pepper, sugar, chillis, spices etc.
- mint leaves, olives and other garnishes

## Knapsack problem
At first, this seems to be a simple variant of the [Knapsack problem](https://en.wikipedia.org/wiki/Knapsack_problem) where: the weight of the items to be put in the knapsack is equivalent to the cost of the ingredients; the sum of the items' costs (or *values*) that has to be maximised is equivalent to the number of cocktails that can be made with a specific set of ingredients; and the weight limit of the knapsack is the same as the budget for purchasing ingredients.

However, after further investigation, the two problems differ significantly: unlike a knapsack item with its cost, **an ingredient does not have a meaningful value of its own**; only a set of ingredients does. For instance, you could very well have a set of 10 ingredients that doesn't allow you to make a single cocktail (`value=0`), but by adding just one more, be able to make 10 cocktails (`value=10`) -- the last ingredient does not have a value of 10; the whole set does.

## Algorithms
### Greedy & Dynamic programing
The two most popular knapsack algorithms require items to have individual values, which means they cannot work well in our situation. I have implemented them anyway, as an experiment, with the assumption that the most logical value for an ingredient is the number of cocktails in which it is used. This leads to highly innacurate results, but results nonetheless.

### Custom greedy (not yet implemented)
This greedy algorithm works as follows:
1. Let `S` be the set of ingredients, which value we want to maximise.
2. Compute the total cost of each cocktail's ingredients.
3. Find the cocktail with the lowest total cost.
4. Add this cocktail's ingredients to `S` if the budget allows it (otherwise, stop here without adding the ingredients)
5. Remove the selected ingredients from every cocktail and start again from step 2.

### Brute force (not yet implemented)
This algorithm computes the value of every possible set of ingredients. A potential optimisation could take advantage of the fact that adding an ingredient cannot decrease the value of a set; the value can only increase or stay the same. For obvious reasons, this algorithm performs very poorly with large numbers of ingredients.
