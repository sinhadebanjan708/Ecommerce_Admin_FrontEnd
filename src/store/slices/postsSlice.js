import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPostsRequest } from "../../api/postsApi";

export const fetchPosts = createAsyncThunk(
  "posts/fetch",
  async (limit, { rejectWithValue }) => {
    try {
      return await getPostsRequest(limit);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load posts";
      });
  },
});

export default postsSlice.reducer;
