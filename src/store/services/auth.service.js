import  axiosInstance  from "../../api/axiosInstance";
const baseURl = "https://plenty-constant-residual.ngrok-free.dev";

let token = localStorage.getItem("access-token");

const AUTH_URL = "/auth";

// export const authService = {
//   getPublicKey: () => api.get("/auth/public-key"),
//   login: (payload) =>
//     api.post(`${AUTH_URL}/login`, payload).then((r) => r.data),
//   logout: () => api.post(`${AUTH_URL}/logout`, {}).then((r) => r.data),
// };

export const logoutService = () => {
  return new Promise(async (resolve, reject) => {
    const refreshToken = localStorage.getItem("refresh-token");
    try {
      let response = axiosInstance.post(
        `/auth/logout`,
        {"refreshToken" : refreshToken}, // request body (empty)
      );
      resolve(response?.data);
    } catch (err) {
      reject(err);
    }
  });
};


export const sendLoginOTP = (emailId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.post(
        `/auth/login`,
        {"email": emailId }, // request body (empty)
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      resolve(response?.data);
    } catch (err) {
      reject(err);
    }
  });
};

export const verifyLoginOTP = (emailId , otp) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.post(
        `auth/login/verify-otp`,
        {"email": emailId , otp: otp }, // request body (empty)
      );
      resolve(response?.data);
    } catch (err) {
      reject(err);
    }
  });
};

export const checkExsistingUser = (emailId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await axiosInstance.post(
        `/auth/check-existing-user`,
        { email: emailId }, // request body (empty)
      );
      resolve(response?.data);
    } catch (err) {
      reject(err);
    }
  });
};


