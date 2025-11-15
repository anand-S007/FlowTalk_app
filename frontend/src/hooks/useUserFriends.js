import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getFriends,
    getRecommendedUsers,
    getOutgoingFriendReqs,
    sendFriendReqs,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendReqs,
    getStreamToken,
    unfriendRequest,
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

export const useGetFriendReqs = () => {
    return useQuery({
        queryKey: ["incoming-friend-reqs"],
        queryFn: getFriendReqs,
        retry: false
    });
};

export const useAcceptFriendReqs = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: acceptFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incoming-friend-reqs'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
            queryClient.invalidateQueries({ queryKey: ['recommended-users'] });
        }
    })
}

export const useRejectFriendReqs = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: rejectFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['incoming-friend-reqs'] });
            queryClient.invalidateQueries({ queryKey: ['friends'] });
        }
    });
}

export const useUnfriend = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: unfriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries(["friends"]);
            queryClient.invalidateQueries(["recommendedUsers"]);
            queryClient.invalidateQueries(["friendRequests"]);
        }
    });
}

export const useStreamToken = (authUser) => {
    return useQuery({
        queryKey: ["stream-token"],
        queryFn: getStreamToken,
        enabled: !!authUser
    })
}