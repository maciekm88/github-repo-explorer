import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import reposReducer from './reposSlice';
import searchReducer from './searchSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    repos: reposReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
