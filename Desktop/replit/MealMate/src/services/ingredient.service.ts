import axios from 'axios';
import { getSpoonacularKey } from '../config/api.config';

const BASE_URL = 'https://api.spoonacular.com';

export interface IngredientSearchResult {
  id: number;
  name: string;
  image: string;
  category: string;
}

// Comprehensive ingredient database with real images
export const searchIngredients = async (query: string): Promise<IngredientSearchResult[]> => {
  try {
    console.log('Searching for:', query);
    const response = await axios.get(`${BASE_URL}/food/ingredients/search`, {
      params: {
        query,
        number: 20,
        apiKey: getSpoonacularKey(),
        metaInformation: true,
      },
      timeout: 10000,
    });

    console.log('Search response:', response.data);

    if (!response.data || !response.data.results || response.data.results.length === 0) {
      console.log('No results found for:', query);
      return [];
    }

    return response.data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}`,
      category: 'other',
    }));
  } catch (error: any) {
    console.error('Error searching ingredients:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.status, error.response.data);
    }
    return [];
  }
};

// Get ingredient suggestions by category
export const getIngredientsByCategory = async (category: string): Promise<IngredientSearchResult[]> => {
  const categoryQueries: { [key: string]: string[] } = {
    vegetables: ['tomato', 'onion', 'carrot', 'broccoli', 'spinach', 'lettuce', 'potato', 'bell pepper', 'cucumber', 'zucchini', 'eggplant', 'cauliflower', 'cabbage', 'celery', 'asparagus', 'green beans', 'peas', 'corn', 'mushroom', 'garlic'],
    fruits: ['apple', 'banana', 'orange', 'strawberry', 'blueberry', 'raspberry', 'mango', 'pineapple', 'watermelon', 'grapes', 'lemon', 'lime', 'peach', 'pear', 'plum', 'cherry', 'kiwi', 'papaya', 'avocado', 'coconut'],
    meat: ['chicken breast', 'ground beef', 'pork chops', 'bacon', 'sausage', 'ham', 'turkey', 'lamb', 'steak', 'chicken thighs', 'ground turkey', 'pork tenderloin', 'beef ribs', 'chicken wings', 'duck'],
    seafood: ['salmon', 'tuna', 'shrimp', 'cod', 'tilapia', 'crab', 'lobster', 'scallops', 'mussels', 'clams', 'sardines', 'anchovies', 'halibut', 'trout', 'catfish'],
    dairy: ['milk', 'cheese', 'butter', 'yogurt', 'cream', 'sour cream', 'cream cheese', 'mozzarella', 'cheddar', 'parmesan', 'feta', 'ricotta', 'cottage cheese', 'goat cheese', 'blue cheese'],
    grains: ['rice', 'pasta', 'bread', 'flour', 'oats', 'quinoa', 'couscous', 'barley', 'bulgur', 'cornmeal', 'noodles', 'tortillas', 'pita bread', 'bagels', 'croissants'],
    spices: ['salt', 'pepper', 'garlic powder', 'onion powder', 'paprika', 'cumin', 'coriander', 'turmeric', 'cinnamon', 'nutmeg', 'ginger', 'oregano', 'basil', 'thyme', 'rosemary', 'curry powder', 'chili powder', 'cayenne'],
    sauces: ['soy sauce', 'tomato sauce', 'hot sauce', 'worcestershire sauce', 'fish sauce', 'oyster sauce', 'teriyaki sauce', 'bbq sauce', 'ketchup', 'mustard', 'mayonnaise', 'ranch dressing', 'vinegar', 'olive oil', 'sesame oil'],
    indian: ['garam masala', 'turmeric', 'cumin seeds', 'coriander powder', 'cardamom', 'cloves', 'bay leaves', 'fenugreek', 'mustard seeds', 'curry leaves', 'paneer', 'ghee', 'basmati rice', 'lentils', 'chickpeas'],
    chinese: ['soy sauce', 'rice vinegar', 'sesame oil', 'ginger', 'garlic', 'scallions', 'bok choy', 'chinese cabbage', 'shiitake mushrooms', 'rice noodles', 'hoisin sauce', 'oyster sauce', 'five spice', 'star anise'],
    italian: ['pasta', 'tomato sauce', 'mozzarella', 'parmesan', 'basil', 'oregano', 'olive oil', 'balsamic vinegar', 'prosciutto', 'pancetta', 'risotto rice', 'pesto', 'marinara', 'ricotta'],
    japanese: ['soy sauce', 'mirin', 'sake', 'miso paste', 'nori', 'wasabi', 'ginger', 'rice vinegar', 'sesame seeds', 'tofu', 'edamame', 'udon noodles', 'soba noodles', 'dashi'],
    mexican: ['tortillas', 'black beans', 'corn', 'cilantro', 'lime', 'jalapeño', 'avocado', 'tomatoes', 'onions', 'cumin', 'chili powder', 'salsa', 'queso fresco', 'sour cream'],
    desserts: ['chocolate', 'vanilla extract', 'sugar', 'brown sugar', 'honey', 'maple syrup', 'cocoa powder', 'chocolate chips', 'condensed milk', 'whipped cream', 'ice cream', 'gelatin', 'sprinkles'],
  };

  const queries = categoryQueries[category.toLowerCase()] || [];
  const results: IngredientSearchResult[] = [];

  // Fetch a few ingredients from the category
  for (const query of queries.slice(0, 10)) {
    const items = await searchIngredients(query);
    if (items.length > 0) {
      results.push(items[0]);
    }
  }

  return results;
};

// Get autocomplete suggestions
export const getIngredientAutocomplete = async (query: string): Promise<IngredientSearchResult[]> => {
  try {
    // Try autocomplete endpoint first
    const response = await axios.get(`${BASE_URL}/food/ingredients/autocomplete`, {
      params: {
        query,
        number: 10,
        apiKey: getSpoonacularKey(),
        metaInformation: true,
      },
      timeout: 10000,
    });

    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        image: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}`,
        category: 'other',
      }));
    }

    // Fallback to search endpoint if autocomplete returns nothing
    console.log('Autocomplete returned no results, trying search endpoint');
    return await searchIngredients(query);
  } catch (error: any) {
    console.error('Error getting autocomplete:', error.message);
    console.log('Falling back to search endpoint');
    
    // Fallback to search endpoint
    try {
      return await searchIngredients(query);
    } catch (searchError) {
      console.error('Search endpoint also failed:', searchError);
      return [];
    }
  }
};
