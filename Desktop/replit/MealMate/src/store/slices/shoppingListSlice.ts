import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ShoppingList, ShoppingItem } from '../../types/user.types';

interface ShoppingListState {
  list: ShoppingList | null;
  loading: boolean;
  error: string | null;
}

const initialState: ShoppingListState = {
  list: {
    id: 'default-list',
    items: [],
    createdDate: new Date(),
    updatedDate: new Date(),
  },
  loading: false,
  error: null,
};

const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<ShoppingItem>) => {
      if (state.list) {
        state.list.items.push(action.payload);
        state.list.updatedDate = new Date();
      }
    },
    addMultipleItems: (state, action: PayloadAction<ShoppingItem[]>) => {
      if (state.list) {
        state.list.items.push(...action.payload);
        state.list.updatedDate = new Date();
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      if (state.list) {
        state.list.items = state.list.items.filter(item => item.id !== action.payload);
        state.list.updatedDate = new Date();
      }
    },
    markAsPurchased: (state, action: PayloadAction<string>) => {
      if (state.list) {
        const item = state.list.items.find(item => item.id === action.payload);
        if (item) {
          item.purchased = !item.purchased; // Toggle instead of just setting to true
        }
        state.list.updatedDate = new Date();
      }
    },
    clearPurchased: (state) => {
      if (state.list) {
        state.list.items = state.list.items.filter(item => !item.purchased);
        state.list.updatedDate = new Date();
      }
    },
    clearAll: (state) => {
      if (state.list) {
        state.list.items = [];
        state.list.updatedDate = new Date();
      }
    },
  },
});

export const {
  addItem,
  addMultipleItems,
  removeItem,
  markAsPurchased,
  clearPurchased,
  clearAll,
} = shoppingListSlice.actions;

export default shoppingListSlice.reducer;
