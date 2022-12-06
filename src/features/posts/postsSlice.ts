import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

const initialState = {
  searchString: '',
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    searchStringSet(state, action) {
      state.searchString = action.payload;
    },
  },
});

export const { searchStringSet } = postsSlice.actions;

export default postsSlice.reducer;

export const selectSearchString = (state: RootState) =>
  state.posts.searchString;
