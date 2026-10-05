import { configureStore } from '@reduxjs/toolkit';
import auth from '../states/auth/slice';

export function createAppStore(preloadedState) {
  return configureStore({ reducer: { auth }, preloadedState });
}

export default createAppStore();
