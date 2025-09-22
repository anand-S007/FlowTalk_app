import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import axiosInstance  from '../lib/axiosInstance.js'

const SignInPage = () => {
  const email = 'anand@gmail.com'
  const password = 123456

  const loginMutation = useMutation({
  mutationFn: async ({ email, password }) => {
    const res = await axiosInstance.post("/auth/signin", {
      email,
      password,
    });
    return res.data;
  },
  onSuccess: (data) => {
    console.log("Login success:", data);
    localStorage.setItem("token", data.token); // store JWT or session token
  },
  onError: (error) => {
    console.error("Login failed:", error.response?.data || error.message);
  },
});

  // loginMutation.mutate({ email, password });
  return (
    <div className='mx-52 my-52'>
      <button onClick={() => {loginMutation.mutate({ email, password })}} className="btn btn-primary">Sign in</button>
    </div>
  )
}

export default SignInPage