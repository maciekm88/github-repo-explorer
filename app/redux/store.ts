import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import reposReducer from './reposSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    repos: reposReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
