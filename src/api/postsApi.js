import axiosInstance from "./axiosInstance";

export const getPostsRequest = async (limit = 10) => {
  const { data } = await axiosInstance.get("/posts", { params: { limit } });
  return data.posts;
};
