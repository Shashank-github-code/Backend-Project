import express from "express";
import {addComment, getVideoComments, deleteComment, updateComment} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route('/:videoId/addComment').post(verifyJWT, addComment);
router.route('/:videoId/getVideoComments').get(verifyJWT, getVideoComments);
router.route('/:commentId/updateComment').patch(verifyJWT, updateComment);
router.route('/:commentId/deleteComment').delete(verifyJWT, deleteComment);

export default router;