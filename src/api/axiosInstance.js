
import axios from "axios";

const TOKEN_KEY = "access-token";
const REFRESH_TOKEN_KEY = "refresh-token";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});
// Separate Axios instance for refreshing tokens.
// This prevents the refresh request from triggering the same interceptor.
const refreshAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store injection
let store;

export const injectStore = (_store) => {
  store = _store;
};

// Track whether a refresh request is already running
let isRefreshing = false;

// Queue requests waiting for the new access token
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ---- Request interceptor ----
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---- Refresh token function ----
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  // Change this endpoint to match your backend route
  const response = await refreshAxios.post(
    "/auth/refresh-token",
    {
      refreshToken,
    }
  );

  // Adjust these fields according to your API response
  const newAccessToken = response.data.accessToken;
  const newRefreshToken = response.data.refreshToken;

  if (!newAccessToken || !newRefreshToken) {
    throw new Error("Invalid refresh token response");
  }

  // Store both new tokens
  localStorage.setItem(TOKEN_KEY, newAccessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

  return newAccessToken;
};

// ---- Response interceptor ----
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isLoginCall =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register");

    const isRefreshCall =
      originalRequest?.url?.includes("/auth/refresh-token");

    // Handle unauthorized requests
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isLoginCall &&
      !isRefreshCall
    ) {
      // If another request is already refreshing the token,
      // wait for that request to finish.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((newToken) => {
          originalRequest.headers =
            originalRequest.headers || {};

          originalRequest.headers.Authorization =
            `Bearer ${newToken}`;

          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Resolve all queued requests
        processQueue(null, newAccessToken);

        // Retry original failed request
        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // Reject all waiting requests
        processQueue(refreshError, null);

        // Clear tokens if refresh fails
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);

        // Dispatch logout/session expired action
        if (store) {
          store.dispatch({
            type: "auth/sessionExpired",
          });
        }

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
