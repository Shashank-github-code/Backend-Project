import express from "express";
import{toggleVideoLike, toggleCommentLike, userLikedVideos, userLikedComments} from "../controllers/like.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route('/toggle/v/:videoId').post(verifyJWT, toggleVideoLike); 
router.route('/toggle/c/:commentId').post(verifyJWT, toggleCommentLike);
router.route('/getLikedvideos').get(verifyJWT, userLikedVideos);
router.route('/getLikedComments').get(verifyJWT, userLikedComments);


export default router;