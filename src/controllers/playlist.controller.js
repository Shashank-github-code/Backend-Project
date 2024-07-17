import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name) {
        throw new ApiError(400, "Playlist name is required");
    }

    // Check for existing playlist
    const existingPlaylist = await Playlist.findOne({ name, user: userId });
    if (existingPlaylist) {
        throw new ApiError(400, "A playlist with the same name already exists");
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        user: userId,
        videos: [],
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newPlaylist, "Playlist created successfully"));
});

export { createPlaylist };