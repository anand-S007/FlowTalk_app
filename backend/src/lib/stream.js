import {StreamChat} from 'stream-chat'
import 'dotenv/config'

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret)
    console.error('Stream api key and secret is missing');

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async(userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting stream user = ", error);
        
    }
}


// TODO: DO IT LATER
export const generateStreamToken = async (userId) => {
    const token = streamClient.createToken(userId);
    return token;
}