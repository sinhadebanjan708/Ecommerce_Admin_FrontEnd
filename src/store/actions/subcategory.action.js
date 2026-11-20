import { fetchsubCategoryService  }
 from "../services/subcategory.service";
// import { showAlert } from "../slices/alertSlice";
import {
storeSubcategoryList
} from "../slices/subcategorySlice";
import { showAlert , hideAlert } from "../slices/alertSlice";
import {
  globalLoaderOpen,
  globalLoaderClose,
} from "../slices/globalSlice";
// import JSEncrypt from "jsencrypt";


export const fetchAllSubCategoris = (pageIndex,pageSize,search) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await fetchsubCategoryService(pageIndex,pageSize,search);

    dispatch(storeSubcategoryList(response?.data));
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
