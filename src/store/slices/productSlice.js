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

const productSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    storeProductList(state,action){
    //   const response = action.payload?.data;
      state.productList = action.payload.data
      state.totalRecords= action.payload.pagination.total
    }
  },
});

export const { storeProductList } = productSlice.actions;
export default productSlice.reducer;