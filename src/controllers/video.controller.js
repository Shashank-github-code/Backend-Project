import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadAVideo = asyncHandler(async(req, res) => {
    const { title, description } = req.body;
    const userId = req.user._id;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    // req.files we get from multer
    // getting the video file path
    const videoFilePath = req.files?.videoFile[0]?.path;

    // getting the thumbnail file if exist 
    let thumbnailPath;
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailPath = req.files.thumbnail[0].path;
    }

    // validating the video file
    if (!videoFilePath) {
        throw new ApiError(400, "Video file is required");
    }
    // uploading on cloudinary
    const videoFile = await uploadOnCloudinary(videoFilePath);
    const thumbnail = await uploadOnCloudinary(thumbnailPath);

    if (!videoFile) {
        throw new ApiError(500, "Failed to upload video to cloudinary");
    }
    // Create video document in the database
    const newVideo = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail?.url || "",
        title,
        description,
        duration: videoFile.duration.toString(), // Assuming Cloudinary provides duration in the result
        owner: userId
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newVideo, "Video uploaded successfully"));
});


const getVideoById = asyncHandler(async(req,res) =>{
    const {userId} = req.params;

    // Check if the userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const videos = await Video.find({owner: userId});

    if(!videos){
        return res.status(200).json(new ApiResponse(200, "No videos found", []));
    }

    return res.status(200).json(new ApiResponse(200, "User videos retrieved successfully", videos))
})

export { uploadAVideo, getVideoById};