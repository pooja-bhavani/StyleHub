import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user.types';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: {
    id: 'default-user',
    tier: 'free',
    scanQuota: {
      used: 0,
      limit: 3,
      resetDate: new Date(new Date().setHours(24, 0, 0, 0)),
    },
    onboardingCompleted: false,
  },
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    incrementScanQuota: (state) => {
      if (state.user) {
        state.user.scanQuota.used += 1;
      }
    },
    resetScanQuota: (state) => {
      if (state.user) {
        state.user.scanQuota.used = 0;
        state.user.scanQuota.resetDate = new Date(new Date().setHours(24, 0, 0, 0));
      }
    },
    upgradeToPremium: (state) => {
      if (state.user) {
        state.user.tier = 'premium';
      }
    },
    completeOnboarding: (state) => {
      if (state.user) {
        state.user.onboardingCompleted = true;
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const {
  incrementScanQuota,
  resetScanQuota,
  upgradeToPremium,
  completeOnboarding,
  setUser,
} = userSlice.actions;

export default userSlice.reducer;
