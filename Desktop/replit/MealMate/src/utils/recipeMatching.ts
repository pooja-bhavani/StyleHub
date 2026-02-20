import { Recipe, RecipeMatch } from '../types/recipe.types';
import { Ingredient } from '../types/ingredient.types';

export const calculateMatchPercentage = (recipe: Recipe, inventory: Ingredient[]): number => {
  const totalIngredients = recipe.usedIngredientCount + recipe.missedIngredientCount;
  if (totalIngredients === 0) return 0;
  
  return Math.round((recipe.usedIngredientCount / totalIngredients) * 100);
};

export const convertToRecipeMatches = (recipes: Recipe[], inventory: Ingredient[]): RecipeMatch[] => {
  return recipes.map(recipe => ({
    ...recipe,
    matchPercentage: calculateMatchPercentage(recipe, inventory),
    canMakeNow: recipe.missedIngredientCount === 0,
  })).sort((a, b) => b.matchPercentage - a.matchPercentage);
};
