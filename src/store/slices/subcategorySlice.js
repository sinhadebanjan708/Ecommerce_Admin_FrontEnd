import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  token: localStorage.getItem("access-token"),
  user: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  availableUser: null,
  emailId: null,
  subcategoryList: null
}

const subcategorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    storeSubcategoryList(state,action){
      const response = action.payload?.data;
      state.subcategoryList = Array.isArray(response)
    ? response
    : response?.content ?? [];
      state.totalRecords= action.payload.totalElements
    }
  },
});

export const { storeSubcategoryList } = subcategorySlice.actions;
export default subcategorySlice.reducer;