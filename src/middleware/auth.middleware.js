// this middleware while logging out
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async(req, res, next)=>{// verify through token which are in cookies
    // we can get cookies access througth the req as we know (app.use(cookieParser)) is configured

    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"unauthorized access")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;// now here we are sending the user access to req to fetch the id and then delete the tokkens base on that
        next()
    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})