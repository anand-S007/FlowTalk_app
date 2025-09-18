import mongoose from 'mongoose'
import 'dotenv/config'

export const CONNECT_DB = async () => {
    try {
        const DB_CONNECTION = await mongoose.connect(process.env.MONGO_URI)
        console.log(`db connected: ${DB_CONNECTION.connection.host}`);
        
    } catch (error) {
        console.log('db_connect_error = ',error)
        process.exit(1)
    }
}