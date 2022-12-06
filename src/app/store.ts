import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from 'features/api/apiSlice';
import postsReducer from 'features/posts/postsSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    posts: postsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: import.meta.env.MODE === 'development',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
