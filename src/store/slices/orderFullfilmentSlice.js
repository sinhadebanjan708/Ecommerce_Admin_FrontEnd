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

const orderFullfilmentVariantSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    storeOrderFullfilmentList(state,action){
    //   const response = action.payload?.data;
      state.orderFullfilmentList = action.payload.orders
      state.totalOrders = action.payload.pagination?.totalOrders;
    }
  },
});

export const { storeOrderFullfilmentList } = orderFullfilmentVariantSlice.actions;
export default orderFullfilmentVariantSlice.reducer;