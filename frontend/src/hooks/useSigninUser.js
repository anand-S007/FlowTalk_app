import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { signinMutationApi } from "../lib/userAuthApi";
import toast from "react-hot-toast";


// const useSigninUser = () => {
//     const queryClient = useQueryClient()
//     const signinUser = useMutation({
//         mutationFn: signinMutationApi,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["userAuth"] })
//             toast.success("Signin successfully")
//         },
//         onError: (error) => {
//             if(error.response) {
//                 return error.response?.data
//             }
//         },
//     });
//     console.log("signinUser = ",signinUser);
//     return signinUser
    
// }

// const useSigninUser = () => {
//   const queryClient = useQueryClient();

//   const {
//     mutate: asyncSigninUser,
//     isLoading,
//     isError,
//     isSuccess,
//     error,
//     data,
//   } = useMutation({
//     mutationFn: signinMutationApi,

//     // Handle success
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["userAuth"] });
//       toast.success("Signed in successfully");
//       console.log("Signin success:", data);
//     },

//     // Handle error
//     onError: (error) => {
//       let errorMessage = "Something went wrong. Please try again.";

//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }

//       console.error("Signin error:", error);
//       toast.error(errorMessage);
//     },
//   });

//   return {
//     asyncSigninUser,
//     isLoading,
//     isError,
//     isSuccess,
//     error,
//     data, // response from API
//   };
// };

const useSigninUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: signinMutationApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["userAuth"], data);
      toast.success("Signed in successfully");
    }
  });

  return {
    signinUserAsync: mutation.mutateAsync,
    signinUser: mutation.mutate, // optional
    ...mutation,
  };
};

export default useSigninUser