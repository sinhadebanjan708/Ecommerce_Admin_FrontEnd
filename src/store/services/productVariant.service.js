import  axiosInstance  from "../../api/axiosInstance";
const baseURl = "https://plenty-constant-residual.ngrok-free.dev";

let token = localStorage.getItem("access-token");

export const fetchProductVariantService = (
  pageIndex,
  pageSize,
  search,
  productId,
) => {
  const params = new URLSearchParams();

  // MRT pageIndex is 0-based; Spring Boot page is 1-based
  params.append("page", pageIndex );
  params.append("limit", pageSize);

  if (search?.trim()) {
    params.append("search", search.trim());
  }

console.log('params',params)
  return axiosInstance.get(`admin/products/${productId}/variants?page=${pageIndex}&size=${pageSize}&search=${search}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createProductVariantService = async (productId,payload) => {
  const formData = new FormData();
console.log('inside_varaint',productId)
  formData.append("productId", payload.productId);
  formData.append("sku", payload.sku);
  formData.append("price", payload.price);
  formData.append("color", payload.color);
  formData.append("size", payload.size || "");
  formData.append("fit", payload.fit || "");
  formData.append("salePrice", payload.salePrice); // e.g., "ACTIVE" / "DRAFT" or boolean
  formData.append("status", payload.status); // e.g., "ACTIVE" / "DRAFT" or boolean
  formData.append("sellerType", payload.sellerType); // e.g., "ACTIVE" / "DRAFT" or boolean
  formData.append("deliveryDate", payload.deliveryDate); // e.g., "ACTIVE" / "DRAFT" or boolean
  formData.append("salePrice", payload.salePrice); // e.g., "ACTIVE" / "DRAFT" or boolean

  // Only append image if a File was actually selected
 if (Array.isArray(payload.images)) {
    payload.images.forEach((item) => {
        // Handles either a direct File in the array or a { file: File } wrapper
        const file = item instanceof File ? item : item?.file;
        if (file instanceof File) {
        formData.append("images", file);
        }
    });
}

  const response = await axiosInstance.post(`admin/products/${productId}/variants`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response?.data;
};


export const fetchSubCategoryBycategoryId = (categoryId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response;
        response = await axiosInstance.get(
        `sub-categories/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }, // request body (empty)
      );

      resolve(response?.data);
    } catch (err) {
      reject(err);
    }
  });
};
// fetchSubCategoryBycategoryId



// export const updateProductVariantService = async (
//   productId,
//   variantId,
//   payload,
//   images = []
// ) => {
//   const formData = new FormData();

//   const variantPayload = {
//     sku: payload.sku,
//     color: payload.color,
//     size: payload.size,
//     fit: payload.fit,
//     price: payload.price,
//     salePrice: payload.salePrice,
//     status: payload.status,
//     sellerType: payload.sellerType,
//     deliveryDate: payload.deliveryDate,
//   };

//   formData.append(
//     "variant",
//     new Blob([JSON.stringify(variantPayload)], {
//       type: "application/json",
//     }),
//     "variant.json"
//   );

// //   const retainedImageIds = images
// //     .filter((item) => !(item instanceof File) && item?.id != null)
// //     .map((item) => Number(item.id));

// //   formData.append(
// //     "retainedImageIds",
// //     new Blob([JSON.stringify(retainedImageIds)], {
// //       type: "application/json",
// //     }),
// //     "retainedImageIds.json"
// //   );

//   images.forEach((item) => {
//     const file = item instanceof File ? item : item?.file;

//     if (file instanceof File) {
//       formData.append("images", file);
//     }
//   });

//   const response = await axiosInstance.put(
//     `admin/products/${productId}/variants/${variantId}`,
//     formData,
//     {
//       headers: {
//         "Content-Type": undefined,
//       },
//     }
//   );

//   return response?.data;
// };

export const updateProductVariantService = async (
  productId,
  variantId,
  payload,
  images = [],
  deleteImageIds = []
) => {
  const formData = new FormData();

  const variantPayload = {
    sku: payload.sku,
    color: payload.color,
    size: payload.size,
    fit: payload.fit,
    price: payload.price,
    salePrice: payload.salePrice,
    status: payload.status,
    sellerType: payload.sellerType,
      deliveryDate: payload.deliveryDate
    ? `${payload.deliveryDate.substring(0, 10)}T00:00:00`
    : null,
  };

  // JSON multipart part
  const variantBlob = new Blob(
    [JSON.stringify(variantPayload)],
    { type: "application/json" }
  );

  formData.append("variant", variantBlob, "variant.json");

  // Deleted image IDs
  if (deleteImageIds.length > 0) {
    const deleteIdsBlob = new Blob(
      [JSON.stringify(deleteImageIds)],
      { type: "application/json" }
    );

    formData.append(
      "deleteImageIds",
      deleteIdsBlob,
      "deleteImageIds.json"
    );
  }

  // New image files only
  images.forEach((item) => {
    const file = item instanceof File ? item : item?.file;

    if (file instanceof File) {
      formData.append("images", file);
    }
  });

  const response = await axiosInstance.put(
    `admin/products/${productId}/variants/${variantId}`,
    formData
  );

  return response?.data;
};



// export const updateProductVariantService = async (productId , variantId , payload,images) => {
//   const formData = new FormData();

//   formData.append("productId", productId);
//   formData.append("variantId", variantId);
//   formData.append("sku", payload.sku);
//   formData.append("color", payload.color);
//   formData.append("price", payload.price || "");
//   formData.append("salePrice", payload.salePrice || "");
//   formData.append("status", payload.status); // e.g., "ACTIVE" / "DRAFT" or boolean
//   formData.append("sellerType", payload.sellerType); // e.g., "ACTIVE" / "DRAFT" or boolean
//   formData.append("deliveryDate", payload.deliveryDate); 
//   // Variant data as JSON
// // const variantPayload = {
// //   sku,
// //   price,
// //   color,
// //   size,
// //   fit,
// //   salePrice,
// //   status,
// //   sellerType,
// //   deliveryDate,
// //   warehouseId,
// //   quantityAvailable,
// //   quantityReserved,
// //   reorderLevel,
// // };
  
// formData.append(
//   "variant",
//     JSON.stringify(formData)
// );


// const retainedImageIds = images.map((ele) => ele.id); // [8, 11, 2]
// formData.append("retainedImageIds", JSON.stringify(retainedImageIds));

//   // Only append image if a File was actually selected
//   if (Array.isArray(images)) {
//     images.forEach((item) => {
//         // Handles either a direct File in the array or a { file: File } wrapper
//         const file = item instanceof File ? item : item?.file;
//         if (file instanceof File) {
//         formData.append("images", file);
//         }
//     });
// }

//   const response = await axiosInstance.put(`admin/products/${productId}/variants/${variantId}`, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   return response?.data;
// };
// updateCategoryService
// createCategoryService