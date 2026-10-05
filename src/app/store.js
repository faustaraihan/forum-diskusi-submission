import { configureStore } from '@reduxjs/toolkit';
import auth from '../states/auth/slice';
import forum from '../states/forum/slice';

export function createAppStore(preloadedState) {
  return configureStore({ reducer: { auth, forum }, preloadedState });
}

export default createAppStore();
