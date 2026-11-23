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
  return axiosInstance.get(`admin/products/${productId}/variants`, {
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
export const updateProductVariantService = async (productId , variantId , payload) => {
  const formData = new FormData();

  formData.append("categoryId", payload.categoryId);
  formData.append("productName", payload.productName);
  formData.append("slug", payload.slug);
  formData.append("subcategoryId", payload.subcategoryId);
  formData.append("description", payload.description || "");
  formData.append("basePrice", payload.basePrice || "");
  formData.append("status", payload.status); // e.g., "ACTIVE" / "DRAFT" or boolean

  // Only append image if a File was actually selected
  if (payload.image instanceof File) {
    formData.append("image", payload.image); // Must match your backend multer field name (e.g. upload.single("image"))
  }

  const response = await axiosInstance.put(`admin/products/${productId}/variants/${variantId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response?.data;
};
// updateCategoryService
// createCategoryService