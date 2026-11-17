import  axiosInstance  from "../../api/axiosInstance";
const baseURl = "https://plenty-constant-residual.ngrok-free.dev";

let token = localStorage.getItem("access-token");

export const fetchCategoryService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.get(
        `categories/`,
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