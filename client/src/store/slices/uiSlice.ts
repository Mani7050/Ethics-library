import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  soundEnabled: boolean;
  showSplash: boolean;
  showOnboarding: boolean;
}

const initialState: UIState = {
  soundEnabled: true,
  showSplash: true,
  showOnboarding: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    setShowSplash: (state, action: PayloadAction<boolean>) => {
      state.showSplash = action.payload;
    },
    setShowOnboarding: (state, action: PayloadAction<boolean>) => {
      state.showOnboarding = action.payload;
    },
  },
});

export const { toggleSound, setShowSplash, setShowOnboarding } = uiSlice.actions;
export default uiSlice.reducer;
