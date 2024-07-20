import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    console.log('Checking for existing like');
    const checkLike = await Like.findOne({ video: videoId, likedBy: userId });

    if (checkLike) {
        console.log('Like found, deleting...');
        await checkLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Video unliked"));
    }

    console.log('No existing like found, creating new like');
    const newLike = await Like.create({
        video: videoId,
        likedBy: userId
    });

    return res.status(200).json(new ApiResponse(200, newLike, "Video liked"));
});

const toggleCommentLike = asyncHandler(async(req,res) =>{
    const {commentId} = req.params;
    const userId = req.user._id;

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "Invalid video ID");
    }
    const checkComment = await Like.findOne(
        {
            comment: commentId,
            likedBy: userId
        }
    )
    if(checkComment){
        await checkComment.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Comment unliked"));
    }
    const newCommentLike = await Like.create({
        comment: commentId,
        likedBy: userId
    });
    return res.status(200).json(new ApiResponse(200, newCommentLike, "Comment liked"))
})

const userLikedVideos = asyncHandler(async(req,res) => {
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }   

    const likedVideos = await Like.find({
        likedBy: userId,
        video: { $exists: true }, // Ensure the video field exists
        comment: { $exists: false } // Ensure the comment field does not exist
    }).populate('video');

    //.populate() This is a Mongoose method. In response you get the ids of the liked video but by using .populate('')
    // you get the the actual video document(entire description) from the 'video' collection.
    //The 'video' string refers to the field in the Like schema that stores the reference to the Video model
    
    if (likedVideos.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No liked videos found"));
    }
    return res.status(200).json(new ApiResponse(200, likedVideos, "User's liked videos"));
})

const userLikedComments = asyncHandler(async(req,res) => {
    const userId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }
    // for getting only liked comments
    const likedComments = await Like.find({
        likedBy: userId,
        video: { $exists: false }, 
        comment: { $exists: true } 

    }).populate('comment');

    if(likedComments.length === 0){
        return res.status(200).json(new ApiResponse(200, [], "No liked comments found"));
    }

    return res.status(200).json(new ApiResponse(200, likedComments, "User's liked comments"));
})


export { toggleVideoLike, toggleCommentLike, userLikedVideos, userLikedComments}