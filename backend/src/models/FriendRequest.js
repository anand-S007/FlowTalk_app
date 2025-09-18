import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted','rejected'],
        default: 'pending'
    }
},
{
    timestamps: true
})

FriendRequestSchema.index({ recipient: 1, status: 1 });
FriendRequestSchema.index({ sender: 1, status: 1 });

const FriendRequest = new mongoose.model('FriendRequest', FriendRequestSchema);

export default FriendRequest;