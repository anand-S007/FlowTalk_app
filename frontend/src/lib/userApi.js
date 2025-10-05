import axiosInstance from "./axiosInstance"

export const getFriends = async () => {
    const response = await axiosInstance.get('/users/friends');
    return response ? response.data : {};
}

export const getRecommendedUsers = async () => {
    const response = await axiosInstance.get('/users/recommended-users');
    return response ? response.data : {};
}

export const getOutgoingFriendReqs = async () => {
    const response = await axiosInstance.get('/users/outgoing-friend-requests');
    return response ? response.data : {};
}

export const sendFriendReqs = async (userId) => {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response ? response.data : {};
};
