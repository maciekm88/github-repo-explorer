import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchRepos } from '../api/github';
import { Repository } from '../types';

export interface ReposState {
  data: { [username: string]: Repository[] };
  loading: boolean;
  error: string | null;
}

const initialState: ReposState = {
  data: {},
  loading: false,
  error: null,
};

export const fetchUserRepos = createAsyncThunk<
  {
    username: string;
    repos: Repository[];
  },
  { username: string; page: number }
>('repos/fetchUserRepos', async ({ username, page }, { rejectWithValue }) => {
  try {
    const response = await fetchRepos(username, page);
    return { username, repos: response };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    clearRepos(state) {
      state.data = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserRepos.fulfilled,
        (state, action: PayloadAction<{ username: string; repos: Repository[] }>) => {
          state.loading = false;
          const { username, repos } = action.payload;
          if (state.data[username]) {
            state.data[username] = [...state.data[username], ...repos];
          } else {
            state.data[username] = repos;
          }
        },
      )
      .addCase(fetchUserRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch repos';
      });
  },
});

export const { clearRepos } = reposSlice.actions;

export default reposSlice.reducer;
