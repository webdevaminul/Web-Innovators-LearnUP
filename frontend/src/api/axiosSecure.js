import axios from "axios";

// Create an instance of axios with base configuration
const axiosSecure = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000" // Development URL
      : "https://web-innovators-learnup-api.vercel.app", // Production URL
  withCredentials: true, // Ensure credentials (cookies) are included
});

// Request interceptor to add token to request headers
axiosSecure.interceptors.request.use(
  (config) => {
    // Get the access token from local storage
    const token = localStorage.getItem("learnupAccessToken");
    if (token) {
      // Add access token to Authorization header
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and refresh token
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 403 (Forbidden) due to expired token, try to refresh the token
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loop

      try {
        // Make a request to refresh the access token using the refresh token from the cookie
        const res = await axiosSecure.get("/auth/refresh-token");

        // Get the new access token from the response
        const newToken = res.data?.token;

        // Store the new access token in localStorage
        localStorage.setItem("learnupAccessToken", newToken);

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        // Retry the original request with new token
        return axiosSecure(originalRequest);
      } catch (err) {
        console.error("Failed to refresh access token:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error); // If any other error, reject promise
  }
);

export default axiosSecure;
