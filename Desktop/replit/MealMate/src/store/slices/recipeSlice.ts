import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe, RecipeDetail, RecipeMatch, RecipeFilters } from '../../types/recipe.types';

interface RecipeState {
  matches: RecipeMatch[];
  selectedRecipe: RecipeDetail | null;
  searchResults: Recipe[];
  cachedRecipes: RecipeDetail[];
  filters: RecipeFilters;
  loading: boolean;
  error: string | null;
}

const initialState: RecipeState = {
  matches: [],
  selectedRecipe: null,
  searchResults: [],
  cachedRecipes: [],
  filters: {},
  loading: false,
  error: null,
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    setRecipeMatches: (state, action: PayloadAction<RecipeMatch[]>) => {
      state.matches = action.payload;
    },
    setSelectedRecipe: (state, action: PayloadAction<RecipeDetail | null>) => {
      state.selectedRecipe = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Recipe[]>) => {
      state.searchResults = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<RecipeFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    cacheRecipe: (state, action: PayloadAction<RecipeDetail>) => {
      const existing = state.cachedRecipes.findIndex(r => r.id === action.payload.id);
      if (existing !== -1) {
        state.cachedRecipes[existing] = action.payload;
      } else {
        state.cachedRecipes.push(action.payload);
        if (state.cachedRecipes.length > 20) {
          state.cachedRecipes.shift();
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRecipeMatches,
  setSelectedRecipe,
  setSearchResults,
  updateFilters,
  cacheRecipe,
  setLoading,
  setError,
} = recipeSlice.actions;

export default recipeSlice.reducer;
