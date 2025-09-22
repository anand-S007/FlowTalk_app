import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or sessionStorage, cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance