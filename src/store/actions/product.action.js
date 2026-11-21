import { fetchsubCategoryService, createSubCategoryService, fetchSubCategoryBycategoryId, updateSubCategoryService }
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

    dispatch(storeSubcategoryList(response));
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
export const fetchSubCategoryByCategoryId = (categoryId) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await fetchSubCategoryBycategoryId(categoryId);

    dispatch(storeSubcategoryList(response));
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
export const createSubCategory = (payload) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await createSubCategoryService(payload);

    // dispatch(storeCategoryList(response));
     dispatch(fetchAllSubCategoris(0,5))
     dispatch(globalLoaderClose());
    dispatch(
      showAlert({
        type: "success",
        title: "Successful",
        message: `Sub Category Created Successfully`,
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

export const updatesubCategory = (pagination,subcategoryId,payload) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await updateSubCategoryService(subcategoryId , payload);

    // dispatch(storeCategoryList(response));
     dispatch(fetchAllSubCategoris(pagination?.pageIndex,pagination?.pageSize))
     dispatch(globalLoaderClose());
    dispatch(
      showAlert({
        type: "success",
        title: "Successful",
        message: `Sub Category upadted Successfully`,
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
