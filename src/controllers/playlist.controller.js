import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user._id;
    console.log(userId);

    if (!name) {
        throw new ApiError(400, "Playlist name is required");
    }

    // Check for existing playlist in the specific userId
    const existingPlaylist = await Playlist.findOne({ name, user: userId });
    if (existingPlaylist) {
        throw new ApiError(400, "A playlist with the same name already exists");
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        videos: [],
        owner: userId,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newPlaylist, "Playlist created successfully"));
});


const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Check if the userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    // Fetch playlists associated with the user
    const playlists = await Playlist.find({ owner: userId });

    // If no playlists found, respond accordingly
    if (!playlists || playlists.length === 0) {
        return res.status(200).json(new ApiResponse(200, "No playlists found", []));
    }

    // Return playlists
    return res.status(200).json(new ApiResponse(200, "User playlists retrieved successfully", playlists));
});



export { createPlaylist, getUserPlaylists};