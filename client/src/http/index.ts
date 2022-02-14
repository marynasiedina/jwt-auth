import axios, { AxiosRequestConfig } from "axios";
import { AuthResponse } from "../models/response/AuthResponse";

export const API_URL = "http://localhost:5000/api";

const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  return config;
});

// перехватывает bad response когда accessToken умер
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    console.log(error.config);
    const originalRequest = error.config;
    if (error.response.status == 401) {
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        localStorage.setItem("token", response.data.accessToken);
        return api.request(originalRequest);
      } catch (e) {
        console.log(e);
      }
    }
  }
);
export default api;
