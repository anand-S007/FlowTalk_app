import FriendRequest from "../models/FriendRequest.js";
import { User } from "../models/User.js";

// Get recommended users friends
export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },         // exclude current user
                { _id: { $nin: currentUser.friends } },  // exclude friends
                { isOnBoarded: true }                    // only onboarded users
            ]
        })
            .select("-password")
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: recommendedUsers.length,
            recommendedUsers
        });
    } catch (error) {
        console.log("Error in getRecommendedusers controller = ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Get current user's friends
export const getMyFriends = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const user = await User.findById(currentUserId)
            .populate({
                path: "friends",
                select: "-password",
                match: { isOnBoarded: true }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const friends = user.friends || [];

        if (friends.length === 0) {
            return res.status(200).json({
                success: false,
                isEmpty: true,
                message: "No friends yet",
                friends: []
            });
        }

        return res.status(200).json({
            success: true,
            isEmpty: false,
            count: friends.length,
            friends,
            message: "Friends found successfully"
        });
    } catch (error) {
        console.error("Error in getMyFriends controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Send friend request
export const sendFriendRequest = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { id: recipientId } = req.params;

        // Check current user Id is same as recipient id
        if (currentUserId === recipientId)
            return res.status(400).json({
                success: false,
                message: "You can't send friend request yourself."
            });

        const recipient = await User.findById(recipientId);

        // check valid recipient
        if (!recipient)
            return res.status(404).json({
                success: false,
                message: "Recipient not found"
            });

        // Check if user already friend
        if (recipient.friends.includes(currentUserId))
            return res.status(400).json({
                success: false,
                message: `You are already friend with ${recipient.fullname}`
            });

        // Check request already send
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: currentUserId, recipient: recipientId },
                { sender: recipientId, recipient: currentUserId }
            ],
            status: { $ne: 'rejected' }
        })
        if (existingRequest)
            return res.status(400).json({
                success: false,
                message: `A friend request is already exists between you and ${recipient.fullname}`
            })

        const friendRequest = await FriendRequest.create({
            sender: currentUserId,
            recipient: recipientId,
        });

        res.status(201).json({
            success: true,
            message: "Request send successfully",
            friendRequest
        });
    } catch (error) {
        console.error('Error while sending friend request = ', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params

        const friendRequest = await FriendRequest.findById(requestId);

        // Check is their a friend request
        if (!friendRequest)
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            });

        // Verify the current user is the recipient
        if (friendRequest.recipient.toString() !== req.user.id)
            return res.status(403).json({
                success: false,
                message: "You are not authorized to accept this request"
            });

        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add each users to their's friends array
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });

        return res.status(200).json({
            success: true,
            requestId,
            message: "Friend request accepted successfully"
        });

    } catch (error) {
        console.error("Error in friend request accept controller = ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Reject friend request controller
export const rejectFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;

        // Find friend request by id
        const friendRequest = await FriendRequest.findById(requestId)

        if (!friendRequest)
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            });

        // Ensure recipient only can reject
        if (friendRequest.recipient.toString() !== req.user.id)
            return res.status(403).json({
                success: false,
                message: "You are not authorized to reject this request"
            });

        friendRequest.status = "rejected"
        await friendRequest.save();

        res.status(200).json({
            success: true,
            requestId,
            message: "Friend request rejected"
        })
    } catch (error) {
        console.error('Error in rejectFriendRequest controller = ', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Get friend requests
export const getFriendRequests = async (req, res) => {
    try {
        const incomingRequest = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        })
            .populate('sender', "fullname profilePic nativeLanguage learningLanguage timestamps");

        const acceptedRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate('recipient', 'fullname profilePic timestamps');

        const rejecteRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "rejected"
        }).populate('recipient', 'fullname profilePic timestamps');

        res.status(200).json({
            success: true,
            incomingRequest,
            acceptedRequests,
            rejecteRequests,
        });

    } catch (error) {
        console.error('Error at getFriendRequests controller = ', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// Get outgoing friend requests
export const getOutgoingFriendRequests = async (req, res) => {
    try {
        const outGoingFriendRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate('sender', "fullname profilePic nativeLanguage learningLanguage");

        res.status(200).json({
            success: true,
            outGoingFriendRequests
        });
    } catch (error) {
        console.error('Error in getOutgoingFriendRequests controller = ', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}