import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postsSlice";
import globalReducer from "./slices/globalSlice";
import categoryReducer from "./slices/categorySlice";
import alertReducer from "./slices/alertSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    global: globalReducer,
    category: categoryReducer,
    alert:alertReducer
  },
});

export default store;
