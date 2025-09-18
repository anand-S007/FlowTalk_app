import express, { Router } from 'express'

import { onBoard, signIn,signOut,signUp } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signin', signIn)
router.post('/signup', signUp)
router.post('/signout', signOut)

router.post('/onboard', protectRoute, onBoard)

// check if user logged in
router.get('/me',protectRoute, (req, res) => {
    return res.status(200).json({success:true, user:req.user})
})
export default router;
