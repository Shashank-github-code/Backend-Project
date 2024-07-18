import express from "express";
import { createPlaylist, getUserPlaylists, addVideo, removeVideo, deletePlaylist, updatePlaylist} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, createPlaylist);
// Route to get playlists of a specific user
router.get('/:userId/playlists', verifyJWT, getUserPlaylists);
router.route('/:playlistId/videos/:videoId/add').post(verifyJWT, addVideo);
router.route('/:playlistId/videos/:videoId/delete').delete(verifyJWT, removeVideo);
router.route('/:playlistId/delete').delete(verifyJWT, deletePlaylist);
router.route('/:playlistId/update').patch(verifyJWT, updatePlaylist);


export default router;