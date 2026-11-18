import { fetchCategoryService , createCategoryService ,updateCategoryService }
 from "../services/category.service";
// import { showAlert } from "../slices/alertSlice";
import {
storeCategoryList
} from "../slices/categorySlice";
import { showAlert , hideAlert } from "../slices/alertSlice";
import {
  globalLoaderOpen,
  globalLoaderClose,
} from "../slices/globalSlice";
// import JSEncrypt from "jsencrypt";


export const fetchAllCategoris = (pageIndex,pageSize) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await fetchCategoryService(pageIndex,pageSize);

    dispatch(storeCategoryList(response));
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

export const createCategory = (payload) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await createCategoryService(payload);

    // dispatch(storeCategoryList(response));
     dispatch(fetchAllCategoris(0,5))
     dispatch(globalLoaderClose());
    dispatch(
      showAlert({
        type: "success",
        title: "Successful",
        message: `Category Created Successfully`,
      }),
    );

    return { success: true, data: response };
  } catch (err) {
    // err shape from API: { timestamp, status, error, message }
    const message = err?.message || "Login failed";
    dispatch(globalLoaderClose());
    // dispatch(loginFailure(message));
    dispatch(
      showAlert({
        type: "error",
        title: err?.error || "Login Failed",
        message,
      }),
    );

    return { success: false, message };
  } finally {
    // dispatch(globalLoaderClose());
  }
};

export const updateCategory = (categoryId,payload) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await updateCategoryService(categoryId , payload);

    // dispatch(storeCategoryList(response));
     dispatch(fetchAllCategoris(0,5))
     dispatch(globalLoaderClose());
    dispatch(
      showAlert({
        type: "success",
        title: "Successful",
        message: `Category Created Successfully`,
      }),
    );

    return { success: true, data: response };
  } catch (err) {
    // err shape from API: { timestamp, status, error, message }
    const message = err?.message || "Login failed";
    dispatch(globalLoaderClose());
    // dispatch(loginFailure(message));
    dispatch(
      showAlert({
        type: "error",
        title: err?.error || "Login Failed",
        message,
      }),
    );

    return { success: false, message };
  } finally {
    // dispatch(globalLoaderClose());
  }
};
