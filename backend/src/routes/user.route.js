import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    acceptFriendRequest, getFriendRequests,
    getMyFriends, getOutgoingFriendRequests,
    getRecommendedUsers, rejectFriendRequest, sendFriendRequest
} from '../controllers/user.controller.js';

const router = express.Router()

// Apply auth middleware to all routes
router.use(protectRoute)

router.get('/', getRecommendedUsers)
router.get('/friends', getMyFriends)

router.post('/friend-request/:id', sendFriendRequest)
router.put('/friend-request/:id/accept', acceptFriendRequest)
router.put('/friend-request/:id/reject', rejectFriendRequest)

router.get('/firend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendRequests);




export default router;