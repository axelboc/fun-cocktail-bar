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
### Classic greedy & dynamic programing
The two most popular knapsack algorithms require items to have individual values, which means they **cannot work well** in our situation. I have implemented them anyway, as an experiment, with the assumption that the most logical value for an ingredient is the number of cocktails in which it is used. This leads to highly innacurate results, but results nonetheless.

### Custom greedy
This greedy, approximation algorithm works as follows:

1. Let `S` be the set of ingredients, which value we want to maximise.
2. Compute the total cost of each cocktail's ingredients.
3. Find the cocktail with the lowest total cost.
4. Add this cocktail's ingredients to `S` if the budget allows it (otherwise, stop here without adding the ingredients)
5. Remove the selected ingredients from every cocktail and start again from step 2.

This algorithm works **significantly better** than, and is **just as fast** as, the classic knapsack greedy algorithm. Its main strength in comparison is also that it doesn't try to get as close to the maximum budget as possible by adding extra, useless ingredients.

Compared to the brute force algorithm below, this algorithm achieves almost as good results and is, of course, much faster. It is, without a doubt, **the best algorithm** to solve the problem when dealing with a large data set of cocktails and ingredients.

### Brute force
This algorithm computes the value of **every possible set of ingredients**, then returns the one with the highest value within the given buget. If multiple sets compete for the highest value, the cheapest one is returned - in other words, if adding an ingredient to the set doesn't lead to a better value, the ingredient is not added (even if it still fits within the budget). The algorithm has an **exponential complexity**, which means that it cannot be used on large data sets.
