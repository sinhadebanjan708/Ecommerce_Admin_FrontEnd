import { fetchCategoryService }
 from "../services/category.service";
// import { showAlert } from "../slices/alertSlice";
import {
storeCategoryList
} from "../slices/categorySlice";
import {
  globalLoaderOpen,
  globalLoaderClose,
} from "../slices/globalSlice";
// import JSEncrypt from "jsencrypt";


export const fetchAllCategoris = () => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await fetchCategoryService();

    dispatch(storeCategoryList(response?.data));
     dispatch(globalLoaderClose());
    // dispatch(
    //   showAlert({
    //     type: "success",
    //     title: "Login Successful",
    //     message: `Welcome back, ${response.employee?.employeeName || ""}!`,
    //   }),
    // );

    return { success: true, data: response };
  } catch (err) {
    // err shape from API: { timestamp, status, error, message }
    const message = err?.message || "Login failed";
    dispatch(globalLoaderClose());
    // dispatch(loginFailure(message));
    // dispatch(
    //   showAlert({
    //     type: "error",
    //     title: err?.error || "Login Failed",
    //     message,
    //   }),
    // );

    return { success: false, message };
  } finally {
    // dispatch(globalLoaderClose());
  }
};
