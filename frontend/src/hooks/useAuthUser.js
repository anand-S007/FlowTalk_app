import { useQuery } from "@tanstack/react-query";
import { getAuthUserApi } from "../lib/api";

// Custom hook to fetch the currently logged-in user
const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ["userAuth"],
        queryFn: getAuthUserApi,
        retry: false
    });

    return {
        isLoading: authUser.isLoading,
        authUser: authUser.data?.user,
        isError: authUser.isError,
    };
}


export default useAuthUser