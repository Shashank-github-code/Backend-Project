import express from "express";
import { addSubscribtion, getAllSubscribers, getChannelSubscribed } from "../controllers/subscribtion.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();


router.route('/:channelId/addSubscriber').post(verifyJWT, addSubscribtion);
router.route('/:channelId/getAllSubscriber').get(verifyJWT, getAllSubscribers);
router.route('/:subscriberId/getAllChannel').get(verifyJWT, getChannelSubscribed);

export default router;