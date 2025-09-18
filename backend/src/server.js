import express from 'express'
import 'dotenv/config'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.route.js'
import { CONNECT_DB } from './lib/db.js';
 
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use('/api/auth', authRoutes);

app.listen(PORT, async() => {
    await CONNECT_DB()
    console.log(`http://localhost:${PORT}`)
})