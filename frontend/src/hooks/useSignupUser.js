import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signupApi } from "../lib/api";

const useSignupUser = () => {
    const queryClient = useQueryClient()

    const { mutateAsync,isError, error, isPending } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAuth"] })
    }
  })

  return {
    userSignupAsync: mutateAsync,
    isError,
    error,
    isPending
  }
}

export default useSignupUser