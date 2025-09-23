import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'

import toast, {Toaster} from 'react-hot-toast'
import axiosInstance from '../lib/axiosInstance'

const HomePage = () => {
  const queryClient = useQueryClient()
  const {mutate:signoutMutation}  =useMutation({
    queryKey:["userAuth"],
    mutationFn: async() => {
      const response = await axiosInstance.post('/auth/signout')
      return response.data
    },
    onSuccess: () => {
      toast.success("Sign out successfully")
      queryClient.invalidateQueries({queryKey: ["userAuth"]})
    }
  })
  return (
    <div>
      HomePage <br />
      <Toaster/>

      <button onClick={() => {
        signoutMutation()

      }}>
        Sign out
      </button>
    </div>
  )
}

export default HomePage