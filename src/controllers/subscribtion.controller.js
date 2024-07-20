import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Subscribtion } from "../models/subscribtion.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const addSubscribtion = asyncHandler(async (req, res) => {
    const { channelId } = req.params;// which is noting but the other user
    const  subscriberId  = req.user._id;// which is the loggedin user

    if(!mongoose.Types.ObjectId.isValid(subscriberId)){
        throw new ApiError(400, "Invalid subscriber ID");
    }
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400, "Invalid channel ID");
    }

    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(400, "Channel not found");
    }
    // checking if the user is already a subscriber to channel
    const existingSubscribtion = await Subscribtion.findOne({ subscriber: subscriberId, channel: channelId });
    if(existingSubscribtion){
        throw new ApiError(400, "Already subscribed");
    }

    const newSubcriber = await Subscribtion.create({
        subscriber: subscriberId,
        channel: channelId
    });
    return res.status(200).json(new ApiResponse(200, newSubcriber, "Subscribed"));

});
const getAllSubscribers = asyncHandler(async (req,res) => {
    const { channelId } = req.params;
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400, "Invalid channel ID");
    }
    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(400, "Channel not found");
    }
    const subscribers = await Subscribtion.find({ channel: channelId });
    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers found successfully"));
})

const getChannelSubscribed = asyncHandler(async (req,res) => {
    const { subscriberId } = req.params;
    if(!mongoose.Types.ObjectId.isValid(subscriberId)){
        throw new ApiError(400, "Invalid subscriber ID");
    }
    const subscriber = await User.findById(subscriberId);
    if(!subscriber){
        throw new ApiError(400, "subscriber not found");
    }
    const channels = await Subscribtion.find({ subscriber: subscriberId });
    return res.status(200).json(new ApiResponse(200, channels, "Channels found successfully"));
})

export{ addSubscribtion, getAllSubscribers, getChannelSubscribed}
