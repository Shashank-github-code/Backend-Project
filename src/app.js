import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' })); 
app.use(express.static('Public')); 
app.use(cookieParser());

// routes import as userRouter which will bw added in front of /api/v1/users
import userRouter from './routes/user.routes.js'
import playlistRouter from "./routes/playlist.routes.js"


app.use("/api/v1/users",userRouter)  // /api/v1/users/userRouter where (userRouter = all the routes from user.routes file)
app.use("/api/v1/playlists",playlistRouter)

// http://localhost:8000/api/v1/users/register

export{app}