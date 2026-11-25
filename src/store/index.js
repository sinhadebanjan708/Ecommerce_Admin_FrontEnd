import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postsSlice";
import globalReducer from "./slices/globalSlice";
import categoryReducer from "./slices/categorySlice";
import alertReducer from "./slices/alertSlice";
import subcategoryReducer from "./slices/subcategorySlice";
import productReducer from "./slices/productSlice";
import productVariantReducer from "./slices/productVariantSlice";
import orderFullfilmentReducer from "./slices/orderFullfilmentSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    global: globalReducer,
    category: categoryReducer,
    alert:alertReducer,
    subcategory:subcategoryReducer,
    product:productReducer,
    productVarinat:productVariantReducer,
    orderFullfilment:orderFullfilmentReducer
  },
});

export default store;
