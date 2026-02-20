import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ingredient } from '../../types/ingredient.types';

interface InventoryState {
  items: Ingredient[];
  loading: boolean;
  error: string | null;
  lastSyncDate: Date | null;
}

const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
  lastSyncDate: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.items.push(action.payload);
      state.lastSyncDate = new Date();
    },
    addMultipleIngredients: (state, action: PayloadAction<Ingredient[]>) => {
      state.items.push(...action.payload);
      state.lastSyncDate = new Date();
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.lastSyncDate = new Date();
    },
    updateIngredient: (state, action: PayloadAction<Ingredient>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.lastSyncDate = new Date();
      }
    },
    setInventory: (state, action: PayloadAction<Ingredient[]>) => {
      state.items = action.payload;
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
  addIngredient,
  addMultipleIngredients,
  removeIngredient,
  updateIngredient,
  setInventory,
  setLoading,
  setError,
} = inventorySlice.actions;

export default inventorySlice.reducer;
