import  axiosInstance  from "../../api/axiosInstance";
const baseURl = "https://plenty-constant-residual.ngrok-free.dev";

let token = localStorage.getItem("access-token");

export const fetchsubCategoryService = (pageIndex,pageSize,search) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response;
      if(search){
        response = await axiosInstance.get(
        `sub-categories/?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }, // request body (empty)
      );
      }else{
          response = await axiosInstance.get(
           `sub-categories/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
           {
             headers: {
               Authorization: `Bearer ${token}`,
             },
           }, // request body (empty)
         );

      }
      resolve(response?.data);
    } catch (err) {
      reject(err);
    }
  });
};

export const createSubCategoryService = async (payload) => {
//   const formData = new FormData();

//   formData.append("category_id", payload.category_id);
//   formData.append("slug", payload.slug);
//   formData.append("subcategory_name", payload.subcategory_name);
// //   formData.append("description", payload.description || "");
//   formData.append("status", payload.status); // e.g., "ACTIVE" / "DRAFT" or boolean

//   // Only append image if a File was actually selected
//   if (payload.image instanceof File) {
//     formData.append("image", payload.image); // Must match your backend multer field name (e.g. upload.single("image"))
//   }

  const response = await axiosInstance.post("sub-categories/", payload, {
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
export const updateSubCategoryService = async (id , payload) => {
  const formData = new FormData();

  formData.append("subcategoryName", payload.subcategoryName);
  formData.append("slug", payload.slug);
  formData.append("categoryId", payload.categoryId);
//   formData.append("description", payload.description || "");
  formData.append("status", payload.status === true ? "active" : "draft" ); // e.g., "ACTIVE" / "DRAFT" or boolean

  // Only append image if a File was actually selected
  if (payload.image instanceof File) {
    formData.append("image", payload.image); // Must match your backend multer field name (e.g. upload.single("image"))
  }

  const response = await axiosInstance.put(`sub-categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response?.data;
};
// updateCategoryService
// createCategoryService