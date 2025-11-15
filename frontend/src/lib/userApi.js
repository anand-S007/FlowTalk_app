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

export const getFriendReqs = async () => {
    const response = await axiosInstance.get('/users/friend-requests')
    return response ? response.data : {};
}

export const acceptFriendRequest = async (userId) => {
    const response = await axiosInstance.put(`/users/friend-request/${userId}/accept`);
    return response ? response.data : {};
}
export const rejectFriendRequest = async (userId) => {
    const response = await axiosInstance.put(`/users/friend-request/${userId}/reject`);
    return response ? response.data : {};
}

export const unfriendRequest = async (friendId) => {
    const response = await axiosInstance.post(`/users/unfriend/${friendId}`);
    return response ? response.data : {};
}

export const getStreamToken = async () => {
    const response = await axiosInstance.get('/chat/token');

    return response ? response.data : {};
}