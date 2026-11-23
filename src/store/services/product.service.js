import  axiosInstance  from "../../api/axiosInstance";
const baseURl = "https://plenty-constant-residual.ngrok-free.dev";

let token = localStorage.getItem("access-token");

export const fetchProductService = (
  pageIndex,
  pageSize,
  search,
  categoryId,
  subCategoryId
) => {
  const params = new URLSearchParams();

  // MRT pageIndex is 0-based; Spring Boot page is 1-based
  if(pageIndex && pageSize){
      params.append("page", pageIndex );
      params.append("limit", pageSize);
  }

  if (search?.trim()) {
    params.append("search", search.trim());
  }

  if (categoryId) {
    params.append("categoryId", categoryId);
  }

  if (subCategoryId) {
    params.append("subcategoryId", subCategoryId);
  }
console.log('params',params)
  return axiosInstance.get(`admin/products?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createProductService = async (payload) => {
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

  const response = await axiosInstance.post("admin/products", payload, {
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
export const updateProductService = async (id , payload) => {
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

  const response = await axiosInstance.put(`admin/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response?.data;
};
// updateCategoryService
// createCategoryService