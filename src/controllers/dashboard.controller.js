import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Video } from "../models/video.model.js";
import { Subscribtion } from "../models/subscribtion.model.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const channelId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Fetch total number of videos
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Fetch total video views
    const totalVideoViews = await Video.aggregate([
        { $match: { owner: channelId } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    // Fetch total subscribers
    const totalSubscribers = await Subscribtion.countDocuments({ channel: channelId });

    // Fetch total likes on videos
    const totalLikes = await Like.countDocuments({ video: { $in: await Video.find({ owner: channelId }).select('_id') } });

    const stats = {
        totalVideos,
        totalVideoViews: totalVideoViews[0] ? totalVideoViews[0].totalViews : 0,
        totalSubscribers,
        totalLikes
    };

    return res.status(200).json(new ApiResponse(200, stats, "Channel stats retrieved successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const channelId = req.user._id;

    // Validate channelId
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Fetch videos uploaded by the channel
    const videos = await Video.find({ owner: channelId }).lean();

    // If no videos found, return an empty array
    if (!videos || videos.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No videos found for this channel"));
    }

    // Return the response with the videos
    return res.status(200).json(new ApiResponse(200, videos, "Channel videos retrieved successfully"));
});


export { getChannelStats,  getChannelVideos}