import { configureStore } from '@reduxjs/toolkit';

export function createAppStore(preloadedState) {
  return configureStore({ reducer: (state = {}) => state, preloadedState });
}

export default createAppStore();
