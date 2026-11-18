import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: localStorage.getItem("access-token"),
  user: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  availableUser: null,
  emailId: null
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    storeCategoryList(state,action){
      state.categoryList = action.payload.data
      state.totalRecords= action.payload.pagination.totalRecords
    }
  },
});

export const { storeCategoryList } = categorySlice.actions;
export default categorySlice.reducer;