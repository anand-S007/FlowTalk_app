import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getFriends,
    getRecommendedUsers,
    getOutgoingFriendReqs,
    sendFriendReqs,
} from "../lib/userApi";

export const useGetFriends = () => {
    return useQuery({
        queryKey: ["friends"],
        queryFn: getFriends,
        retry: false
    });
};

export const useGetRecommendedUsers = () => {
    return useQuery({
        queryKey: ["recommended-users"],
        queryFn: getRecommendedUsers,
        retry: false
    });
};

export const useGetOutgoingFriendReqs = () => {
    return useQuery({
        queryKey: ["outgoing-friend-reqs"],
        queryFn: getOutgoingFriendReqs,
        retry: false
    });
};

export const useSendFriendReqs = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: sendFriendReqs,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["outgoing-friend-reqs"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    })
}

// export const useGetIncomingFriendReqs = () => {
//   return useQuery({
//     queryKey: ["incoming-friend-reqs"],
//     queryFn: getIncomingFriendReqs,
//     retry:false
//   });
// };
