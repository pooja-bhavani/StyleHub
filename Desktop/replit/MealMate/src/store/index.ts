import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import inventoryReducer from './slices/inventorySlice';
import recipeReducer from './slices/recipeSlice';
import userReducer from './slices/userSlice';
import shoppingListReducer from './slices/shoppingListSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['inventory', 'user', 'shoppingList'],
  timeout: 10000,
};

const rootReducer = combineReducers({
  inventory: inventoryReducer,
  recipes: recipeReducer,
  user: userReducer,
  shoppingList: shoppingListReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
