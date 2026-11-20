import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postsSlice";
import globalReducer from "./slices/globalSlice";
import categoryReducer from "./slices/categorySlice";
import alertReducer from "./slices/alertSlice";
import subcategoryReducer from "./slices/subcategorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    global: globalReducer,
    category: categoryReducer,
    alert:alertReducer,
    subcategory:subcategoryReducer,
  },
});

export default store;
