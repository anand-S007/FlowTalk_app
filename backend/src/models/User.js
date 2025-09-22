import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    bio: {
        type: String,
        default: '',
        trim: true,
    },
    profilePic: {
        type: String,
        default: ''
    },
    nativeLanguage: {
        type: String,
        default: '',
        trim: true
    },
    learningLanguage: {
        type: String,
        default: '',
        trim: true,
    },
    location: {
        type: String,
        default: '',
        trim: true,
    },
    isOnBoarded: {
        type: Boolean,
        default: false
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
},{timestamps:true})


// Pre hook
userSchema.pre('save',async function(next) {
    try {

        if(!this.isModified('password')) {
            return next();
        }

        const SALT = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, SALT);
        next();
    } catch (error) {
        next(error);
    }
})

export const User = mongoose.model('User', userSchema);