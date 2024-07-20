import mongoose from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user._id;
    console.log(userId);

    if (!name) {
        throw new ApiError(400, "Playlist name is required");
    }

    // Check for existing playlist in the specific userId
    const existingPlaylist = await Playlist.findOne({ name, owner: userId });
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

const addVideo = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    
    // validate the ids
    if(!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400, "Invalid playlist or video ID");
    }

    // check if the ids are present or not
    const playlist = await Playlist.findById(playlistId);// playlist get in this variable if present
    if(!playlist){
        throw new ApiError(400, "Playlist not found");
    }
    const video = await Video.findById(videoId);// similarly video get in this variable if present
    if(!video){
        throw new ApiError(400, "Video not found");
    }

    // check if video already exists in playlist
    // playlist.videos is an array containing the IDs of videos (so can apply array oprations like .includes .indexOf)
    const videoPresent =await playlist.videos.includes(videoId);
    if(videoPresent){
        throw new ApiError(400, "Video already exists in this playlist");
    }

    // Add the video to the playlist
    playlist.videos.push(videoId);
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
});

const removeVideo = asyncHandler(async (req, res) => {
    const { playlistId, videoId} = req.params;

    // validate the ids
    if(!mongoose.Types.ObjectId.isValid(videoId) || !mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400, "Invalid playlist or video ID");
    }

    // check if the ids are present or not
    const playlist = await Playlist.findById(playlistId);// playlist get in this variable if present
    if(!playlist){
        throw new ApiError(400, "Playlist not found");
    }
    const video = await Video.findById(videoId);// similarly video get in this variable if present
    if(!video){
        throw new ApiError(400, "Video not found");
    }

    // check if video exists in playlist so to delete it
    // playlist.videos is an array containing the IDs of videos in the playlist.
    const videoIndex = await playlist.videos.indexOf(videoId);
    if( videoIndex === -1){
        return res.status(400).json(new ApiResponse(400, null, "Video is not in the playlist"));
    }
    playlist.videos.splice(videoIndex,1);//playlist.videos.splice(videoIndex, 1) removes 1 element starting from the position videoIndex.
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "video deleted successfully"))
})

const deletePlaylist = asyncHandler(async (req,res) => {
    const {playlistId} = req.params

    if(!mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(400, "Playlist not found");
    }

    await playlist.deleteOne()

    return res.status(200).json(new ApiResponse(200, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req,res) => {
    const { playlistId} = req.params
    const { name, description } = req.body;

    if(!mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400, "Invalid playlist ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(400, "Playlist not found");
    }
    playlist.name = name;
    playlist.description = description;
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, "Playlist updated successfully"))
})

export { createPlaylist, getUserPlaylists, addVideo, removeVideo, deletePlaylist, updatePlaylist};