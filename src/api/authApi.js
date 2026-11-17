import axiosInstance from "./axiosInstance";

export const loginRequest = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  return data; // { accessToken, refreshToken, id, username, email, ... }
};

export const getMeRequest = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data;
};
