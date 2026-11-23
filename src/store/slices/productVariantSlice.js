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

const productVariantSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    storeProductVariantList(state,action){
    //   const response = action.payload?.data;
      state.productVariantList = action.payload
      state.totalRecords = action.payload.data?.length || 0;
    }
  },
});

export const { storeProductVariantList } = productVariantSlice.actions;
export default productVariantSlice.reducer;