import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    // Validate videoId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    // Validate comment
    if (!comment) {
        throw new ApiError(400, "Comment is required");
    }
    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(400, "Video not found");
    }

    const newComment = await Comment.create({
        comment,
        video: videoId,
        owner: userId,
    });

    return res.status(200).json(new ApiResponse(200, newComment, "Comment added successfully"));
});

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate videoId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const skip = (page - 1) * limit;// (page no -1)* limit gives how many comments to skip
    // Fetch comments from the database
    const comments = await Comment.find({ video: videoId })
        .skip(skip)
        .limit(parseInt(limit))

    // Get the total count of comments
    const totalComments = await Comment.countDocuments({ video: videoId });
    const totalPages = Math.ceil(totalComments / limit);
    // Create the response data
    const responseData = {
        comments,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages,
            totalComments
        }
    };

    // Return the response
    return res.status(200).json(new ApiResponse(200, responseData, "Comments retrieved successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { newComment } = req.body;

    // Validate videoId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    // Validate comment
    if (!newComment) {
        throw new ApiError(400, "New comment is required");
    }
    // Check if the comment exists
    const getComment = await Comment.findById(commentId);
    if (!getComment) {
        throw new ApiError(404, "Comment not found");
    }
    getComment.comment = newComment;
    await getComment.save(); // .save() is imp as it will not get updated inn database
    return res.status(200).json(new ApiResponse(200, getComment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    // Validate videoId
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    // Check if the comment exists
    const getComment = await Comment.findById(commentId);
    if (!getComment) {
        throw new ApiError(404, "Comment not found");
    }
    await getComment.deleteOne();
    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully"));

});
export { addComment, getVideoComments, deleteComment, updateComment }