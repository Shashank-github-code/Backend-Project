import mongoose,{Schema} from 'mongoose'

const userSchema=new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        emai:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName:{
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar:{
            type: String,// cloudinary url
            required: true,
        },
        coverImage:{
            type: String,
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password:{
            type: String,
            required: [true,'Password is required'],
        },
        refreshToken:{
            type: String
        }
    },
    {
        timestamp: true
    }
)
// The .pre method is a Mongoose middleware function. 
//It allows you to define pre-save hooks that run before a document is saved to the database.
// async function(next) { ... }: This defines an asynchronous function to be executed before the save operation. The next parameter is a callback function that must be called to proceed to the next middleware or complete the operation.
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.ispasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}
//jwt.sign({ ... }): This calls the sign method from the jsonwebtoken (JWT) library. The sign method generates a new JSON Web Token (JWT).
userSchema.methods.generateAccessToken = function(){
    jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },  
    process.env.ACCESS_TOKEN_SECRRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
    },  
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}
export const User = mongoose.model("User",userSchema)
