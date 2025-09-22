import axiosInstance from "./axiosInstance";

// Api for signup user
export const signupApi = async (signupData) => {
  const response = await axiosInstance.post('/auth/signup', signupData);
  return response.data
}

// Api for Fetching currently authenticated user
export const getAuthUserApi = async () => {
  const res = await axiosInstance.get('/auth/me');
  return res.data
}


export const completeOnboarding = async (userData) => {
  const res = await axiosInstance.post('/auth/onboard', userData);
  return res ? res.data : {}
}