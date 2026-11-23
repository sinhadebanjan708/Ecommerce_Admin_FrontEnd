import { fetchProductService, createProductService, fetchSubCategoryBycategoryId, updateProductService }
 from "../services/product.service";
// import { showAlert } from "../slices/alertSlice";
import {
storeProductList
} from "../slices/productSlice";
import { showAlert , hideAlert } from "../slices/alertSlice";
import {
  globalLoaderOpen,
  globalLoaderClose,
} from "../slices/globalSlice";
// import JSEncrypt from "jsencrypt";


export const fetchAllProducts = (
  pageIndex,
  pageSize,
  search,
  categoryId,
  subCategoryId
) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());

    console.log("Fetching products...", {
      pageIndex,
      pageSize,
      search,
      categoryId,
      subCategoryId,
    });

    const response = await fetchProductService(
      pageIndex,
      pageSize,
      search,
      categoryId,
      subCategoryId
    );

    console.log("Product API response:", response.data?.data);

    dispatch(storeProductList(response.data?.data));

    return {
      success: true,
      data: response.data,
    };
  } catch (err) {
    console.error("Fetch products error:", err);

    return {
      success: false,
      message: err?.response?.data?.message || err?.message || "Failed to fetch products",
    };
  } finally {
    dispatch(globalLoaderClose());
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
export const createProduct = (payload) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await createProductService(payload);

    // dispatch(storeCategoryList(response));
     dispatch(fetchAllProducts(0,5))
     dispatch(globalLoaderClose());
    dispatch(
      showAlert({
        type: "success",
        title: "Successful",
        message: `Product Created Successfully`,
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

export const updateProduct = (pagination,productId,payload) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await updateProductService(productId , payload);

    // dispatch(storeCategoryList(response));
     dispatch(fetchAllProducts(pagination?.pageIndex,pagination?.pageSize))
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
