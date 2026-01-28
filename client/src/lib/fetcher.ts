import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://automation-flow-server.vercel.app/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  },
);
