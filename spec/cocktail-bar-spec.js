import CocktailBar from '../cocktail-bar';

describe("CocktailBar", function() {
  
  const BUDGET = 200;
  
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
  
  beforeEach(function () {
    this.bar = new CocktailBar(BUDGET, INGREDIENTS, COCKTAILS);
  });
  
  describe("#computeIngrValues", function() {
    
    it("computes the value of each ingredient", function() {
      let ingrValues = this.bar.computeIngrValues(COCKTAILS);
      expect([...ingrValues]).toEqual([
        ['lemon juice', 3],
        ['vodka', 2],
        ['gin', 1]
      ]);
    });
    
  });
    
});

