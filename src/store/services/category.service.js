import  axiosInstance  from "../../api/axiosInstance";
const baseURl = "https://plenty-constant-residual.ngrok-free.dev";

let token = localStorage.getItem("access-token");

export const fetchCategoryService = async (
  pageIndex,
  pageSize,
  search
) => {
  try {
    const response = await axiosInstance.get("categories/", {
      params: {
        pageIndex,
        pageSize,
        ...(search ? { search } : {}),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    throw err;
  }
};

export const createCategoryService = async (payload) => {
  const formData = new FormData();

  formData.append("categoryName", payload.name);
  formData.append("slug", payload.slug);
  formData.append("departmentId", payload.department_id);
  formData.append("description", payload.description || "");
  formData.append("status", payload.status); // e.g., "ACTIVE" / "DRAFT" or boolean

  // Only append image if a File was actually selected
  if (payload.image instanceof File) {
    formData.append("image", payload.image); // Must match your backend multer field name (e.g. upload.single("image"))
  }

  const response = await axiosInstance.post("categories/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response?.data;
};
export const updateCategoryService = async (id , payload) => {
  const formData = new FormData();

  formData.append("categoryName", payload.categoryName);
  formData.append("slug", payload.slug);
  formData.append("departmentId", payload.department.id);
  formData.append("description", payload.description || "");
  formData.append("status", payload.status === true ? "active" : "draft" ); // e.g., "ACTIVE" / "DRAFT" or boolean

  // Only append image if a File was actually selected
  if (payload.image instanceof File) {
    formData.append("image", payload.image); // Must match your backend multer field name (e.g. upload.single("image"))
  }

  const response = await axiosInstance.put(`categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response?.data;
};
// updateCategoryService
// createCategoryService