import axios from 'axios';
import { Recipe, RecipeDetail } from '../types/recipe.types';
import { getSpoonacularKey } from '../config/api.config';

const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

export const searchRecipesByIngredients = async (
  ingredients: string[],
  number: number = 10
): Promise<Recipe[]> => {
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/findByIngredients`, {
      params: {
        ingredients: ingredients.join(','),
        number,
        ranking: 1,
        ignorePantry: true,
        apiKey: getSpoonacularKey(),
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error('Spoonacular API Error:', error);
    throw new Error('Failed to fetch recipes. Please try again.');
  }
};

export const getRecipeInformation = async (recipeId: number): Promise<RecipeDetail> => {
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/${recipeId}/information`, {
      params: {
        apiKey: getSpoonacularKey(),
      },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error('Spoonacular API Error:', error);
    throw new Error('Failed to fetch recipe details. Please try again.');
  }
};

export const searchRecipes = async (
  query: string,
  filters?: { maxReadyTime?: number; cuisine?: string; diet?: string[] }
): Promise<Recipe[]> => {
  try {
    const response = await axios.get(`${SPOONACULAR_BASE_URL}/recipes/complexSearch`, {
      params: {
        query,
        number: 10,
        ...filters,
        diet: filters?.diet?.join(','),
        apiKey: getSpoonacularKey(),
      },
      timeout: 10000,
    });

    return response.data.results;
  } catch (error) {
    console.error('Spoonacular API Error:', error);
    throw new Error('Failed to search recipes. Please try again.');
  }
};
