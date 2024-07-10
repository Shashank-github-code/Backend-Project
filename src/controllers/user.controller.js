import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"


const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken () // both are given to the user
        const refreshToken = user.generateRefreshToken () // it is stored in database so that constantly login is not required

        user.refreshToken = refreshToken  // it is added to the database
        await user.save({ ValidateBeforeSave: false }) // to save it

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}


const registerUser = asyncHandler( async (req,res)=>{

    // get user details from frontend through (Postman)
    // validation - not empty
    // check if user already exits : username, email
    // check for images, check for avatar
    // upload them to cloudinary. avatar 
    // create user object - create entry in DB
    // remove password and refresh token field from reponse
    // check for user creation 
    // return response

    const {fullName, email, username, password} = req.body  // all the data comes from the body portion of frontend and this is destructured
    // if(fullName === ""){
    //     throw new ApiError(400, "Full name is required");
    // }

    //instead of writting if for all fields we can use .some method to ensure none of the fields are empty. If any field is empty, it throws an ApiError with status code 400.
    if ([fullName, email, username, password].some((field) => field?.trim() === ""))
    {
        throw new ApiError(400, "All fields are compulsory");
    }

    // here User is mongoose created(in user model) that talks to DB
    // .findOne is a database call
    const existedUser = await User.findOne({   //$or takes an array of object to apply any function like .findOne so if any field matches either of the two 
        $or:[{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exist")
    }

    //uploading files on cloudinary
    // req.files we get from multer
    const avatarLocalPath = req.files?.avatar[0]?.path;
    
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
            coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required");
    }

    // sending in database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    //checking if user created or not
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"// these two fields are not selected
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // after creating returning the response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // passworfd check
    // access and refresh token
    // send cookies

    const {email, userName ,password} = req.body
    if(!userName || !email){
        throw new ApiError(400,"Username or password is required")
    }

    const user = await User.findOne({
        $or: [{userName}, {email}]
    })

    if(!user){
        throw new ApiError(404,"User doesnot exist")
    }

    const isPasswordvalid = await user.isPasswordCorrect(password)

    if(!isPasswordvalid){
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)// passing the parameter to get the tokens

   const loggedUser = await  User.findById(user._id)// donot require specific fields in the new logged user so creating a new constant
   .select("-password -refreshToken")

    const options = {
        http: true,
        secure: true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .jason(
        new ApiResponse(// sending the parameter to the Apiresponse constructor
            200,
            {
                user: loggedUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

// const logoutUser = asyncHandler(async (req, res) => {
//     // no req.body access here as there is not post req for logout 
//     // so we need a middleware which gives the user access to the req to delete the tokken using some id 
//     // the middleware is auth.middleware.js
//     await User.findByIdAndUpdate(
//         req.user._id,
//         { 
//             $set:{             //$set: This is a MongoDB update operator that sets the value of a field in the document.
//                 refreshToken: undefined
//             }
//         },
//         {
//             new: true
//         }
//     )

//     const options = {
//         http: true,
//         secure: true
//     }
//     return res
//     .status(200)
//     .clearCookie("accessToken", options)
//     .clearCookie("refreshToken", options)
//     .jason(new ApiResponse(200, {}, "User logged out successfully"))

// })

export { registerUser, loginUser, logoutUser } 