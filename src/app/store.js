import { configureStore } from '@reduxjs/toolkit';
import auth from '../states/auth/slice';
import forum from '../states/forum/slice';
import leaderboards from '../states/leaderboards/slice';

export function createAppStore(preloadedState) {
  return configureStore({ reducer: { auth, forum, leaderboards }, preloadedState });
}

export default createAppStore();
