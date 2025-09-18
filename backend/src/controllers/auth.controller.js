import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import jwt from 'jsonwebtoken'
import { upsertStreamUser } from "../lib/stream.js";

// Sign in
export async function signIn(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and passwords are required" });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User with this email does not exist." });

        const matchPassword = await bcrypt.compare(String(password), user.password);
        if (!matchPassword)
            return res.status(401).json({ message: "Invalid password" });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });
        res.cookie("jwt", token, {
            expiresIn: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // Prevents xss attack
            sameSite: "strict", // Prevents csrf attack
            secure: process.env.NODE_ENV === "production"
        });

        const { _id, fullname, email: userEmail } = user
        res.status(200).json({
            success: true,
            user: {
                _id, fullname, email: userEmail
            }
        });

    } catch (error) {
        console.error("Error while signin = ", error)
        res.status(500).json({ message: "Internal server error" });
    }
}

// Sign up
export async function signUp(req, res) {
    try {
        const { fullname, email, password } = req.body;

        // Validating the user data
        if (!fullname || !email || !password)
            return res.status(400).json({ message: 'All fields are required' });

        if (String(password).length < 6) {
            console.log('validation triggerd');
            return res.status(400).json({ message: 'Password must be at least 6 characters ' });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email))
            return res.status(400).json({ message: 'Ivalid email format' });

        const emailExist = await User.findOne({ email });
        if (emailExist)
            return res.status(400).json({ message: "Email already exists, please try with another email" })

        // Generates random avatar profile
        const index = Math.floor(Math.random() * 100) + 1 // Generating a random number between 1 - 100
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;

        const newUser = new User({
            fullname,
            email,
            password,
            profilePic: randomAvatar
        });
        await newUser.save();

        // Create/Update user in Stream
        try {
            await upsertStreamUser({
                name: newUser.fullname,
                id: newUser._id.toString(),
                image: newUser.profilePic || ''
            })
            console.log(`Stream user created for ${newUser.fullname}`);
        } catch (error) {
            console.error('Error found while creating stream user = ', error);
        }

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d",
        });
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // Prevents xss attack
            sameSite: "strict", // Prevents csrf attack
            secure: process.env.NODE_ENV === "production"
        });

        const { _id, fullname: name, email: userEmail, profilePic } = newUser;
        res.status(201).json(
            {
                success: true,
                message: "User registered successfully.",
                user: {
                    _id, name, email: userEmail, profilePic
                }
            }
        );

    } catch (error) {
        console.error("Error in signup controller = ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Sign out
export async function signOut(req, res) {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ success: true, message: "Signout successfully" })
    } catch (error) {
        console.error("Error at logout = ", error)
    }
}

export async function onBoard(req, res) {
    try {
        const userId = req.user._id;

        const { fullname, bio, nativeLanguage, learningLanguage, location } = req.body;

        // Validating the user data
        if (!fullname || !bio || !nativeLanguage || !learningLanguage || !location)
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullname && 'fullname',
                    !bio && 'bio',
                    !nativeLanguage && 'nativeLanguage',
                    !learningLanguage && 'learningLanguage',
                    !location && 'location'
                ].filter(Boolean)
            });

            // Update database
        const updatedUser = await User.findByIdAndUpdate(userId,{
            fullname,
            bio,
            nativeLanguage,
            learningLanguage,
            location,
            isOnBoarded: true
        },{new:true, runValidators:true}).select("-password")
        
        if(!updatedUser)
            return res.status(404).json({message:"User not found"});

        try {
            const upsertStreamData = await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullname,
                image: updatedUser.profilePic || ""
            })
            console.log("Stream user updated after onboarding = ",upsertStreamData);
        } catch (error) {
            console.error('Error while stream user upserting onboarding =  ',error);
            
        }

        res.status(200).json({success:true, user:updatedUser, message:"User boarded successfull"})
    } catch (error) {

    }
}