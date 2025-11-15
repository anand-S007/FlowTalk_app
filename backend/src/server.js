import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const PORT = process.env.PORT || 3000;

// Route handlers
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js'

// Database connection function
import { CONNECT_DB } from './lib/db.js';

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://flowtalk-po50.onrender.com"
    ],
    credentials: true
}))
// Middleware to parse json request bodies
app.use(express.json());
// Middleware to parse cookies from client request
app.use(cookieParser())

// Mount authentication routes
app.use('/api/auth', authRoutes);
// Mount user-related routes
app.use('/api/users', userRoutes);
// Mount chat routes
app.use('/api/chat', chatRoutes);

// Start server and DB_connection
app.listen(PORT, async () => {
    await CONNECT_DB()
    console.log(`http://localhost:${PORT}`)
})