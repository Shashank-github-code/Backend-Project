import express from 'express';
import { uploadAVideo, getVideoById} from '../controllers/video.controller.js';
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// adding a middleware
// can upload an array of video objects
router.post('/publish', 
    verifyJWT,
    upload.fields([
        { name: 'videoFile', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    uploadAVideo
);
router.get('/:userId/videos', verifyJWT, getVideoById);

export default router;