import { fetchProductVariantService, createProductVariantService , updateProductVariantService}
 from "../services/productVariant.service";
// import { showAlert } from "../slices/alertSlice";
import {
storeProductVariantList
} from "../slices/productVariantSlice";
import { showAlert , hideAlert } from "../slices/alertSlice";
import {
  globalLoaderOpen,
  globalLoaderClose,
} from "../slices/globalSlice";
// import JSEncrypt from "jsencrypt";


export const fetchAllProductVariants = (
  productId,
  pageIndex,
  pageSize,
  search
 
) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());

    console.log("Fetching products...", {
      pageIndex,
      pageSize,
      search,
    productId
    });

    const response = await fetchProductVariantService(
      pageIndex,
      pageSize,
      search,
      productId
    );

    console.log("Product varaint API response:", response.data?.data);

    dispatch(storeProductVariantList(response.data?.data));

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
export const createProductVariant = (productId, payload) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await createProductVariantService(productId,payload);

    // dispatch(storeCategoryList(response));
     dispatch(fetchAllProductVariants(productId,0,5))
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

export const updateProductVariant = (pagination,productId,variantId,payload,images,deleteImageIds) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());
    // response shape: { employee: {...}, menus: [...] }
    const response = await updateProductVariantService(productId , variantId , payload,images,deleteImageIds);

    // dispatch(storeCategoryList(response));
     dispatch(fetchAllProductVariants(productId,pagination?.pageIndex,pagination?.pageSize,""))
     dispatch(globalLoaderClose());
    dispatch(
      showAlert({
        type: "success",
        title: "Successful",
        message: `Product Variant updated Successfully`,
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
    dispatch(globalLoaderClose());
  }
};
// export const fetchSubCategoryByCategoryId = (categoryId) => async (dispatch) => {
//   try {
//     dispatch(globalLoaderOpen());
//     // response shape: { employee: {...}, menus: [...] }
//     const response = await fetchSubCategoryBycategoryId(categoryId);

//     dispatch(storeSubcategoryList(response));
//      dispatch(globalLoaderClose());
//     // dispatch(
//     //   showAlert({
//     //     type: "success",
//     //     title: "Login Successful",
//     //     message: `Welcome back, ${response.employee?.employeeName || ""}!`,
//     //   }),
//     // );

//     return { success: true, data: response };
//   } catch (err) {
//     // err shape from API: { timestamp, status, error, message }
//     const message = err?.message || "Login failed";
//     dispatch(globalLoaderClose());
//     // dispatch(loginFailure(message));
//     // dispatch(
//     //   showAlert({
//     //     type: "error",
//     //     title: err?.error || "Login Failed",
//     //     message,
//     //   }),
//     // );

//     return { success: false, message };
//   } finally {
//     // dispatch(globalLoaderClose());
//   }
// };



