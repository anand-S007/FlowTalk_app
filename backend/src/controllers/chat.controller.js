import { generateStreamToken } from "../lib/stream.js"

export const getStreamToken = async (req, res) => {
    try {
        const user = req.user
        const token = generateStreamToken(user.id)

        return res.status(200).json({
            success: true,
            token,
            message: "Stream token generated successfully"
        })
    } catch (error) {
        console.error('Error in getStreamToken controller = ', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}