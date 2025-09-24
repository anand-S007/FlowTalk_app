import axiosInstance from "./axiosInstance";

// Api for signup user
export const signupApi = async (signupData) => {
  const response = await axiosInstance.post('/auth/signup', signupData);
  return response.data
}

// GET AUTH USER DATA API
export const getAuthUserApi = async () => {
  const res = await axiosInstance.get('/auth/me');
  return res.data
}

// ONBOARD POST REQUEST API
export const completeOnboarding = async (userData) => {
  const res = await axiosInstance.post('/auth/onboard', userData);
  return res ? res.data : {}
}


export const signinMutationApi = async (formState) => {
  const res = await axiosInstance.post("/auth/signin", formState);

  return res ? res.data : {};
}

export const signoutApi = async () => {
  const response = await axiosInstance.post('/auth/signout')
  return response.data
}