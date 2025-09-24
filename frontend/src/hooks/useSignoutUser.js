import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signoutApi } from "../lib/userAuthApi";
import toast from "react-hot-toast";

const useSignoutUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: signoutApi,
        onSuccess: () => {
            toast.success("Signed out successfully ✅");
            setTimeout(() => {
                queryClient.setQueryData(["userAuth"], null);
            }, 1000);
        }
    });
    
    return {
        signoutUser : mutation.mutateAsync,
        isPending: mutation.isPending
    };
};

export default useSignoutUser;
