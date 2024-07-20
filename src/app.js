import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' })); 
app.use(express.static('Public')); 
app.use(cookieParser());

// routes import as userRouter which will bw added in front of /api/v1/users
import userRouter from './routes/user.routes.js'
import playlistRouter from "./routes/playlist.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import subscribtionRouter from "./routes/subscribtion.routes.js"
import likeRouter from "./routes/like.routes.js"

app.use("/api/v1/users", userRouter);  // /api/v1/users/userRouter where (userRouter = all the routes from user.routes file)
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/subscribtions", subscribtionRouter);
app.use("/api/v1/likes", likeRouter);

// http://localhost:8000/api/v1/users/register

export { app };