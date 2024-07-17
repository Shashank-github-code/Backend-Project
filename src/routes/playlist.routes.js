import express from "express";
import { createPlaylist, getUserPlaylists} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJWT, createPlaylist);
// Route to get playlists of a specific user
router.get('/:userId/playlists', verifyJWT, getUserPlaylists);



export default router;