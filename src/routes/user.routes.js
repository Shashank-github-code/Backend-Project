import { Router } from "express";
import { registerUser,loginUser, logoutUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar,updateUserCoverImage,getUserChannelProfile, getWatchHistory} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
import { refreshAccessToken } from "../controllers/user.controller.js";

//This line creates a new instance of a router object. This router object will be used to define the routes.
const router = Router()

//router.route("/register"): This specifies that the route being defined is /register.
// .post(registerUser): This specifies that the route /register will respond to HTTP POST requests. When a POST request is made to /register, the registerUser function will be called to handle the request. The registerUser function is expected to contain the logic for handling user registration.
router.route("/register").post(
    // using a middleware just before the registerUser method
    //.fields accepts array
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)// patch if few deatils are to be changed

router.route("/avatar").patch(verifyJWT,upload.single("Avatar",updateUserAvatar))

router.route("/cover-image").patch(verifyJWT,upload.single("CoverImage"),updateUserCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)//  /c/:" "   this route is used as params is being used in controller

router.route("/history").get(verifyJWT,getWatchHistory)

export default router