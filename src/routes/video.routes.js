import express from 'express';
import { uploadAVideo, getVideoById, updateVideo, togglePublishStatus, deleteVideo} from '../controllers/video.controller.js';
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// adding a middleware
// can upload an array of video objects
// It can be used to create a new resource or append data to an existing resource
router.post('/publish', 
    verifyJWT,
    upload.fields([
        { name: 'videoFile', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    uploadAVideo
);

router.get('/:userId/videos', verifyJWT, getVideoById);

router.route('/:videoId/update').put(//PUT is used to send data to a server to create/update a resource
    verifyJWT,
    upload.fields([
        {
            name: 'thumbnail',
            maxCount: 1
        }
    ]),
    updateVideo
);

router.route('/:videoId/delete').delete(verifyJWT, deleteVideo);//When a client sends an HTTP DELETE request to a server, it asks the server to delete the specified resource, such as a file or a database record

router.route('/:videoId/toggle-publish').patch(verifyJWT, togglePublishStatus);// when partial data has to be updated
// whole documentation update use (put req) when partial data to be updated use (patch req)

export default router;

