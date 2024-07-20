import mongoose, {Schema} from "mongoose"

const subscribtionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId,  // the one who is subscribing
        ref:"User"
    },
    channel:{
        type: Schema.Types.ObjectId,  // one to whom subscriber is subscribing
        ref:"User"
    }
},{timestamps:true})

export const Subscribtion = mongoose.model("Subscribtion",subscribtionSchema)