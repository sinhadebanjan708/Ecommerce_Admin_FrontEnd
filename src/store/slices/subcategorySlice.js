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
      state.subcategoryList = action.payload.content
      state.totalRecords= action.payload.totalElements
    }
  },
});

export const { storeSubcategoryList } = subcategorySlice.actions;
export default subcategorySlice.reducer;