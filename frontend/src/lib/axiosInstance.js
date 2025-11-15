import axios from "axios";

// On development use this
// const axiosInstance = axios.create({
//     baseURL: "http://localhost:3000/api",
//     withCredentials: true,
// })

// On production use this
const API = import.meta.env.VITE_API_URL;
const axiosInstance = axios.create({
    baseURL: API,
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