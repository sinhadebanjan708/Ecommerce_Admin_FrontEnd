import { fetchOrderFullfilmentService, createProductVariantService , updateProductVariantService}
 from "../services/orderFullfilment.service";
// import { showAlert } from "../slices/alertSlice";
import {
storeOrderFullfilmentList
} from "../slices/orderFullfilmentSlice";
import { showAlert , hideAlert } from "../slices/alertSlice";
import {
  globalLoaderOpen,
  globalLoaderClose,
} from "../slices/globalSlice";
// import JSEncrypt from "jsencrypt";


export const fetchAllOrderFullfilment = (
  pageIndex,
  pageSize,
  status
 
) => async (dispatch) => {
  try {
    dispatch(globalLoaderOpen());

    console.log("Fetching products...", {
      pageIndex,
      pageSize,
      status
    });

    const response = await fetchOrderFullfilmentService(
      pageIndex,
      pageSize,
     status
    );

    console.log("Product varaint API response:", response.data?.data);

    dispatch(storeOrderFullfilmentList(response.data?.data));

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
// export const createProductVariant = (productId, payload) => async (dispatch) => {
//   try {
//     dispatch(globalLoaderOpen());
//     // response shape: { employee: {...}, menus: [...] }
//     const response = await createProductVariantService(productId,payload);

//     // dispatch(storeCategoryList(response));
//      dispatch(fetchAllProductVariants(productId,0,5))
//      dispatch(globalLoaderClose());
//     dispatch(
//       showAlert({
//         type: "success",
//         title: "Successful",
//         message: `Product Created Successfully`,
//       }),
//     );

//     return { success: true, data: response };
//   } catch (err) {
//     // err shape from API: { timestamp, status, error, message }
//     const message = err?.message || "Login failed";
//     dispatch(globalLoaderClose());
//     // dispatch(loginFailure(message));
//     dispatch(
//       showAlert({
//         type: "error",
//         title: err?.error || "Login Failed",
//         message,
//       }),
//     );

//     return { success: false, message };
//   } finally {
//     // dispatch(globalLoaderClose());
//   }
// };

// export const updateProductVariant = (pagination,productId,variantId,payload,images,deleteImageIds) => async (dispatch) => {
//   try {
//     dispatch(globalLoaderOpen());
//     // response shape: { employee: {...}, menus: [...] }
//     const response = await updateProductVariantService(productId , variantId , payload,images,deleteImageIds);

//     // dispatch(storeCategoryList(response));
//      dispatch(fetchAllProductVariants(productId,pagination?.pageIndex,pagination?.pageSize,""))
//      dispatch(globalLoaderClose());
//     dispatch(
//       showAlert({
//         type: "success",
//         title: "Successful",
//         message: `Product Variant updated Successfully`,
//       }),
//     );

//     return { success: true, data: response };
//   } catch (err) {
//     // err shape from API: { timestamp, status, error, message }
//     const message = err?.message || "Login failed";
//     dispatch(globalLoaderClose());
//     // dispatch(loginFailure(message));
//     dispatch(
//       showAlert({
//         type: "error",
//         title: err?.error || "Login Failed",
//         message,
//       }),
//     );

//     return { success: false, message };
//   } finally {
//     dispatch(globalLoaderClose());
//   }
// };

