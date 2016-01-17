import CocktailBar from '../cocktail-bar';

describe("CocktailBar", function() {
  
  const BUDGET = 50;
  
  const INGREDIENTS = new Map([
    ['gin', 34],
    ['lemon juice', 2],
    ['vodka', 30]
  ]);
  
  const COCKTAILS = new Map([
    ['Bloody Mary', ['vodka', 'lemon juice']],
    ['Gin Fizz', ['gin', 'lemon juice']],
    ['Screwdriver', ['vodka', 'lemon juice']]
  ]);
  
  const INGR_COCKTAILS = new Map([
    ['vodka', ['Bloody Mary', 'Screwdriver']],
    ['lemon juice', ['Bloody Mary', 'Gin Fizz', 'Screwdriver']],
    ['gin', ['Gin Fizz']]
  ]);
  
  const INGR_VALUES = new Map([
    ['lemon juice', 3],
    ['vodka', 2],
    ['gin', 1]
  ]);
  
  const INGR_RATIOS = new Map([
    ['lemon juice', 3 / 2],
    ['vodka', 2 / 30],
    ['gin', 1 / 34]
  ]);
  
  const SOLUTION = {
    ingredients: ['lemon juice', 'vodka'],
    totalCost: 32,
    cocktails: ['Bloody Mary', 'Screwdriver'],
    totalValue: 2,
    excludedIngredients: ['gin'],
    excludedCocktails: ['Gin Fizz']
  };
  
  beforeEach(function () {
    this.bar = new CocktailBar(BUDGET, INGREDIENTS, COCKTAILS);
  });
  
  describe("#mapIngrToCocktails", function() {
    it("maps each ingredient to the cocktails in which it is used", function() {
      let ingrCocktails = this.bar.mapIngrToCocktails(COCKTAILS);
      expect([...ingrCocktails]).toEqual([...INGR_COCKTAILS]);
    });
  });
  
  describe("#sortMapDesc", function () {
    it("sorts a map into descending order of numerical values", function () {
      let sortedMap = this.bar.sortMapDesc(INGREDIENTS);
      expect([...sortedMap]).toEqual([
        ['gin', 34],
        ['vodka', 30],
        ['lemon juice', 2]
      ]);
    });
  });
  
  describe("#computeIngrValues", function() {
    it("computes the value of each ingredient", function() {
      let ingrValues = this.bar.computeIngrValues(INGR_COCKTAILS);
      expect([...ingrValues]).toEqual([...INGR_VALUES]);
    });
  });
  
  describe("#computeIngrRatios", function() {
    it("computes the value of each ingredient", function() {
      let ingrRatios = this.bar.computeIngrRatios(INGREDIENTS, INGR_VALUES);
      expect([...ingrRatios]).toEqual([...INGR_RATIOS]);
    });
  });
  
  describe("#solveGreedy", function () {
    it("finds the optimal set of ingredients for the bar using a greedy algorithm", function () {
      let solution = this.bar.solveGreedy(BUDGET, INGREDIENTS, INGR_RATIOS);
      expect(solution).toEqual({
        ingredients: SOLUTION.ingredients,
        totalCost: SOLUTION.totalCost
      });
    });
  });
  
  describe("#findPossibleCocktails", function () {
    it("finds the cocktails that can be made with a specific set of ingredients", function () {
      let cocktails = this.bar.findPossibleCocktails(COCKTAILS, SOLUTION.ingredients);
      expect(cocktails).toEqual(['Bloody Mary', 'Screwdriver']);
    });
  });
  
  describe("#computeDiff", function () {
    it("computes the difference between two arrays", function () {
      let excluded = this.bar.computeDiff([...INGREDIENTS.keys()], SOLUTION.ingredients);
      expect(excluded).toEqual(SOLUTION.excludedIngredients);
    });
  });
  
  describe("#solve", function () {
    it("can solve the problem with a greedy algorithm", function () {
      let solution = this.bar.solve('greedy');
      expect(solution).toEqual(SOLUTION);
    });
  });
    
});

